'use client';

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';

export default function DebugPage() {
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(
    null,
  );
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setLocalStorageToken(token);
    }
  }, []);

  const testAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // デバッグエンドポイントを呼び出す
      const response = await fetch('/api/debug/auth', {
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
      });

      const data = await response.json();
      setTestResult(data);
    } catch (err: any) {
      console.error('デバッグテストエラー:', err);
      setError(err.message || 'テスト実行中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateThread = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // スレッド作成をテスト
      const testData = {
        title: 'デバッグ用テストスレッド',
        description: 'これはデバッグテスト用のスレッドです',
      };

      const result = await api.threads.create(testData);
      setTestResult({
        message: 'スレッド作成成功',
        createdThread: result,
      });
    } catch (err: any) {
      console.error('スレッド作成テストエラー:', err);
      setError(err.message || 'スレッド作成テスト中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">認証デバッグ</h1>

        <div className="mb-8 p-4 border rounded">
          <h2 className="text-xl font-bold mb-4">ローカルストレージトークン</h2>
          <p className="mb-2">
            トークンの状態: {localStorageToken ? '存在する' : '存在しない'}
          </p>
          {localStorageToken && (
            <>
              <p className="mb-2">トークン長: {localStorageToken.length}</p>
              <p className="mb-2">
                トークン先頭: {localStorageToken.substring(0, 20)}...
              </p>
              <p className="mb-2">
                Bearerプレフィックス:{' '}
                {localStorageToken.startsWith('Bearer ') ? 'あり' : 'なし'}
              </p>
              <div className="mt-4 p-2 bg-gray-100 rounded overflow-auto">
                <code className="text-sm break-all">{localStorageToken}</code>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={testAuth}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '実行中...' : '認証テスト実行'}
          </button>

          <button
            onClick={testCreateThread}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? '実行中...' : 'スレッド作成テスト'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            <p className="font-bold">エラー:</p>
            <p>{error}</p>
          </div>
        )}

        {testResult && (
          <div className="p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">テスト結果</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
