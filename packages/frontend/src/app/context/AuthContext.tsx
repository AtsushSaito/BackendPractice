'use client';

import React, { createContext, useContext } from 'react';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
  fetchUserProfile: () => Promise<User | null>;
}

// デフォルト値を設定
const defaultContext: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
  logout: () => {},
  fetchUserProfile: async () => null,
};

// コンテキストを作成
const AuthContext = createContext<AuthContextType>(defaultContext);

// プロバイダーコンポーネント
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// カスタムフック
export function useAuthContext() {
  return useContext(AuthContext);
} 