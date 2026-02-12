import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User as AppUser } from '@/types/regulation';
import { supabase, supabaseUrl, supabaseKey } from '@/lib/supabase';
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

// Set to true to debug auth on production (Vercel). Filter console by "[Auth]".
const AUTH_DEBUG = true;
const LOG = (msg: string, ...args: unknown[]) => {
  if (typeof window !== 'undefined' && AUTH_DEBUG) {
    console.log('[Auth]', msg, ...args);
  }
};

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

const PROFILE_SELECT = 'id,email,full_name,role,plan,region,trial_used_at,created_at';

/** Fetch profile using access token directly (works even when setSession times out on restore). */
async function fetchProfileWithToken(userId: string, accessToken: string): Promise<ProfileRow | null> {
  LOG('fetchProfileWithToken start', { userId });
  const url = `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=${encodeURIComponent(PROFILE_SELECT)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseKey,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    LOG('fetchProfileWithToken error', { status: res.status, statusText: res.statusText });
    return null;
  }
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    LOG('fetchProfileWithToken no data');
    return null;
  }
  LOG('fetchProfileWithToken ok', { id: row.id, email: row.email });
  return row as ProfileRow;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const SET_SESSION_TIMEOUT_MS = 3000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const lastSignedInTokenRef = useRef<string | null>(null);

  const setUserFromSession = useCallback(async (
    sess: Session | null,
    options?: { skipClientSetSession?: boolean }
  ) => {
    LOG('setUserFromSession called', { hasSession: !!sess, userId: sess?.user?.id, skipClientSetSession: options?.skipClientSetSession });
    if (!sess?.user?.id) {
      LOG('setUserFromSession: no session/user, clearing state');
      setUser(null);
      setSession(null);
      return;
    }
    if (options?.skipClientSetSession) {
      LOG('setUserFromSession: setSession with timeout', SET_SESSION_TIMEOUT_MS, 'ms');
      await Promise.race([
        supabase.auth.setSession({
          access_token: sess.access_token,
          refresh_token: sess.refresh_token ?? '',
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('setSession timeout')), SET_SESSION_TIMEOUT_MS)
        ),
      ]).catch((e) => LOG('setSession catch/timeout', e));
    } else {
      LOG('setUserFromSession: awaiting setSession');
      await supabase.auth.setSession({
        access_token: sess.access_token,
        refresh_token: sess.refresh_token ?? '',
      }).catch((e) => LOG('setSession catch', e));
    }
    LOG('setUserFromSession: calling fetchProfileWithToken');
    const profile = await fetchProfileWithToken(sess.user.id, sess.access_token);
    if (!profile) {
      LOG('setUserFromSession: no profile, clearing state');
      setUser(null);
      setSession(null);
      return;
    }
    LOG('setUserFromSession: setting user/session state');
    setSession(sess);
    setUser(profileToUser(profile));
    LOG('setUserFromSession done');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        LOG('initial getSession (restore on load/refresh)');
        const { data: { session: sess } } = await supabase.auth.getSession();
        LOG('initial getSession result', { hasSession: !!sess, userId: sess?.user?.id });
        if (sess) {
          LOG('initial restore: calling setUserFromSession');
          await setUserFromSession(sess);
          LOG('initial restore: setUserFromSession returned');
        } else {
          LOG('initial restore: no session (user will appear logged out)');
        }
      } catch (e) {
        LOG('initial getSession catch', e);
      } finally {
        setLoading(false);
        LOG('initial auth loading complete');
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      LOG('onAuthStateChange', { event, hasSession: !!sess });
      if (event === 'INITIAL_SESSION') return;
      if (event === 'SIGNED_OUT') {
        lastSignedInTokenRef.current = null;
        await setUserFromSession(null);
        return;
      }
      if (!sess) return;
      if (event === 'SIGNED_IN') {
        const token = sess.access_token;
        if (lastSignedInTokenRef.current === token) {
          LOG('onAuthStateChange: skipping duplicate SIGNED_IN for same session');
          return;
        }
        lastSignedInTokenRef.current = token;
      }
      LOG('onAuthStateChange calling setUserFromSession', { event });
      await setUserFromSession(sess, { skipClientSetSession: true });
      LOG('onAuthStateChange setUserFromSession returned', { event });
    });

    return () => subscription.unsubscribe();
  }, [setUserFromSession]);

  const login = async (email: string, password: string): Promise<void> => {
    LOG('login start', { email });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      LOG('login signInWithPassword error', { message: error.message });
      if (error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('credentials')) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Sign in failed');
    }
    LOG('login signInWithPassword ok', { hasSession: !!data.session, userId: data.session?.user?.id });
    if (data.session) {
      if (lastSignedInTokenRef.current === data.session.access_token) {
        LOG('login: skipping setUserFromSession, already handled by listener');
      } else {
        lastSignedInTokenRef.current = data.session.access_token;
        LOG('login calling setUserFromSession');
        await setUserFromSession(data.session, { skipClientSetSession: true });
        LOG('login setUserFromSession returned');
      }
    } else {
      LOG('login no session in response');
    }
    LOG('login done');
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
    if (data.session) {
      if (lastSignedInTokenRef.current === data.session.access_token) {
        LOG('register: skipping setUserFromSession, already handled by listener');
      } else {
        lastSignedInTokenRef.current = data.session.access_token;
        LOG('register calling setUserFromSession');
        await setUserFromSession(data.session, { skipClientSetSession: true });
        LOG('register setUserFromSession returned');
      }
    }
    LOG('register done');
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
