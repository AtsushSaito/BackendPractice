import { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザー情報を取得する関数
  const fetchUserProfile = async () => {
    try {
      const userData = await api.auth.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
      return userData;
    } catch (error) {
      console.error('認証エラー:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      return null;
    }
  };

  // ログアウト関数
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    // 他のコンポーネントに通知
    window.dispatchEvent(new Event('storage'));
    console.log('ログアウト処理を完了しました');
  };

  // コンポーネントマウント時とlocalStorageの変更時に認証状態を確認
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (token) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('認証エラー:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    // localStorageの変更を監視
    const handleStorageChange = () => {
      console.log('ストレージ変更を検出しました');
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setIsLoggedIn(false);
      } else if (!isLoggedIn) {
        // トークンがあるが、ログインしていない場合は再取得
        fetchUserProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    isLoggedIn,
    isLoading,
    logout,
    fetchUserProfile,
  };
}
