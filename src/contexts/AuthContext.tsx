import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as AppUser } from '@/types/regulation';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  plan: string;
  region: string | null;
  trial_used_at: string | null;
  created_at?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, region: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function profileToUser(profile: ProfileRow): AppUser {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name ?? undefined,
    role: (profile.role === 'admin' ? 'admin' : 'user') as AppUser['role'],
    bookmarks: [],
    plan: (profile.plan as AppUser['plan']) ?? 'free',
    region: profile.region ?? 'Global',
    trial_used_at: profile.trial_used_at ?? undefined,
    created_at: profile.created_at,
  };
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, plan, region, trial_used_at, created_at')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as ProfileRow;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const setUserFromSession = useCallback(async (
    sess: Session | null,
    options?: { skipClientSetSession?: boolean }
  ) => {
    if (!sess?.user?.id) {
      setUser(null);
      setSession(null);
      return;
    }
    if (options?.skipClientSetSession) {
      // Fire-and-forget: set session so the client has the JWT for fetchProfile, but don't await (avoids hang).
      void supabase.auth.setSession({
        access_token: sess.access_token,
        refresh_token: sess.refresh_token ?? '',
      }).catch(() => {});
    } else {
      await supabase.auth.setSession({
        access_token: sess.access_token,
        refresh_token: sess.refresh_token ?? '',
      }).catch(() => {});
    }
    const profile = await fetchProfile(sess.user.id);
    if (!profile) {
      setUser(null);
      setSession(null);
      return;
    }
    setSession(sess);
    setUser(profileToUser(profile));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session: sess } } = await supabase.auth.getSession();
        if (sess) await setUserFromSession(sess);
      } catch {
        // only end loading; do not clear user
      } finally {
        setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      if (event === 'INITIAL_SESSION') return;
      if (event === 'SIGNED_OUT') {
        await setUserFromSession(null);
        return;
      }
      if (!sess) return;
      await setUserFromSession(sess);
    });

    return () => subscription.unsubscribe();
  }, [setUserFromSession]);

  const login = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('credentials')) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Sign in failed');
    }
    if (data.session) await setUserFromSession(data.session, { skipClientSetSession: true });
  };

  const register = async (email: string, password: string, name: string, region: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, region },
      },
    });
    if (error) {
      if (error.message?.toLowerCase().includes('already registered') || error.code === 'user_already_exists') {
        throw new Error('An account with this email already exists.');
      }
      throw new Error(error.message || 'Sign up failed');
    }
    if (data.user && !data.session) {
      throw new Error('Please check your email to confirm your account.');
    }
    if (data.session) await setUserFromSession(data.session, { skipClientSetSession: true });
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};
