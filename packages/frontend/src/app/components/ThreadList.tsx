'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Thread } from '../types';
import { api } from '../utils/api';

export default function ThreadList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setIsLoading(true);
        const threadsData = await api.threads.getAll();
        setThreads(threadsData);
        setError(null);
      } catch (err) {
        console.error('スレッド取得エラー:', err);
        setError('スレッドの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (threads.length === 0) {
    return (
      <div className="text-center p-4">
        スレッドがありません。新しいスレッドを作成してください。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">スレッド一覧</h2>
      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id} className="border p-4 rounded">
            <Link
              href={`/threads/${thread.id}`}
              className="text-xl font-medium hover:underline block"
            >
              {thread.title}
            </Link>
            <p className="text-gray-600 mt-2">{thread.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              作成日: {new Date(thread.createdAt).toLocaleString()}
              {thread.user && ` | 作成者: ${thread.user.username}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
