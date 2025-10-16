import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/regulation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, region: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('missick_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validate that the user object has required fields
        if (parsedUser && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('missick_user');
          setUser(null);
        }
      } catch (error) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem('missick_user');
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication with different user types
    const credentials = {
      'admin@missick.com': { password: 'admin123', role: 'admin', plan: 'enterprise' },
      'premium@missick.com': { password: 'premium123', role: 'user', plan: 'professional' },
      'free@missick.com': { password: 'free123', role: 'user', plan: 'free', region: 'Europe' },
      'user@missick.com': { password: 'user123', role: 'user', plan: 'free', region: 'North America' }
    };
    
    const userCreds = credentials[email as keyof typeof credentials];
    if (userCreds && userCreds.password === password) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        role: userCreds.role as 'admin' | 'user',
        bookmarks: [],
        plan: userCreds.plan,
        region: userCreds.region || 'Global'
      };
      setUser(newUser);
      localStorage.setItem('missick_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string, region: string): Promise<boolean> => {
    // Mock registration - create new free user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: 'user',
      bookmarks: [],
      plan: 'free',
      region: region
    };
    setUser(newUser);
    localStorage.setItem('missick_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('missick_user');
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};