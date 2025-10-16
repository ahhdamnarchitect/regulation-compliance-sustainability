import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/regulation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
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
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const isAdmin = email === 'admin@missick.com' && password === 'admin123';
    const isUser = email === 'user@missick.com' && password === 'user123';
    
    if (isAdmin || isUser) {
      const newUser: User = {
        id: isAdmin ? 'admin-1' : 'user-1',
        email,
        role: isAdmin ? 'admin' : 'user',
        bookmarks: []
      };
      setUser(newUser);
      localStorage.setItem('missick_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock registration - create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: 'user',
      bookmarks: []
    };
    setUser(newUser);
    localStorage.setItem('missick_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('missick_user');
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