'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, type User } from '../lib/api';

type AuthContextValue = {
  token: string;
  user: User | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string; passwordConfirm: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('marketplaceToken') || '';
    setToken(savedToken);

    if (!savedToken) {
      setIsReady(true);
      return;
    }

    apiRequest<{ data: { user: User } }>('/api/v1/users/me', { token: savedToken })
      .then(data => setUser(data.data.user))
      .catch(() => {
        window.localStorage.removeItem('marketplaceToken');
        setToken('');
        setUser(null);
      })
      .finally(() => setIsReady(true));
  }, []);

  async function login(email: string, password: string) {
    const data = await apiRequest<{ token: string; data: { user: User } }>('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    window.localStorage.setItem('marketplaceToken', data.token);
    setToken(data.token);
    setUser(data.data.user);
  }

  async function signup(payload: { name: string; email: string; password: string; passwordConfirm: string }) {
    const data = await apiRequest<{ token: string; data: { user: User } }>('/api/v1/users/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    window.localStorage.setItem('marketplaceToken', data.token);
    setToken(data.token);
    setUser(data.data.user);
  }

  async function logout() {
    try {
      await apiRequest('/api/v1/users/logout', { token });
    } finally {
      window.localStorage.removeItem('marketplaceToken');
      setToken('');
      setUser(null);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isReady,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout
    }),
    [token, user, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
