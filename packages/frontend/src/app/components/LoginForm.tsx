'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../utils/api';
import { LoginData } from '../types';
import { useAuthContext } from '../context/AuthContext';

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fetchUserProfile } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // トークンを保存し、ストレージイベントを発火させる関数
  const saveTokenAndNotify = (token: string) => {
    try {
      console.log('Saving token to localStorage, length:', token.length);

      // トークンを保存
      localStorage.setItem('token', token);

      // 他のタブやウィンドウに変更を通知するためにイベントをディスパッチ
      const event = new Event('storage');
      window.dispatchEvent(event);

      // 保存されたか確認
      const savedToken = localStorage.getItem('token');
      console.log('Token saved:', savedToken ? 'Success' : 'Failed');
      if (savedToken) {
        console.log(
          'Saved token starts with:',
          savedToken.substring(0, 15) + '...',
        );
      }
    } catch (e) {
      console.error('Error saving token:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await api.auth.login(formData);
        console.log('Login response:', response);

        // accessToken と access_token の両方のフォーマットに対応
        const token = response.access_token || response.accessToken;

        if (token) {
          // トークンをローカルストレージに保存
          saveTokenAndNotify(token);

          // ユーザー情報を取得 (AuthContextの状態を更新)
          await fetchUserProfile();

          // ホームページにリダイレクト
          router.push('/');
          router.refresh();
        } else {
          setError('ログインレスポンスからトークンが取得できませんでした。');
          console.error('トークンが見つかりません:', response);
        }
      } catch (err: unknown) {
        console.error('ログインエラー:', err);

        // エラーメッセージの内容から適切なメッセージを表示
        if (
          err instanceof Error &&
          err.message.includes('Invalid credentials')
        ) {
          // ユーザー名が存在するか確認
          try {
            const checkUser = await fetch(
              `/api/users?username=${formData.username}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              },
            );

            const userData = await checkUser.json();

            // ユーザーが存在しない場合
            if (!userData || userData.length === 0) {
              setError(
                `ユーザー名「${formData.username}」は登録されていません。アカウント登録が必要です。`,
              );
            } else {
              // ユーザーは存在するがパスワードが間違っている場合
              setError('パスワードが正しくありません。再度お試しください。');
            }
          } catch (_) {
            // ユーザー確認に失敗した場合は一般的なエラーメッセージ
            setError(
              'ログイン情報が正しくありません。ユーザー名とパスワードを確認してください。',
            );
          }
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'ログインに失敗しました。認証情報を確認してください。',
          );
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">ログイン</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-medium">
            ユーザー名:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            パスワード:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <p className="mt-4 text-center">
        アカウントをお持ちでない場合は
        <Link href="/register" className="text-blue-500 hover:underline ml-1">
          アカウント登録
        </Link>
      </p>
    </div>
  );
}
