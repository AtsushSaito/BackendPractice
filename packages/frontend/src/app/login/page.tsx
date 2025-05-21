'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);

  useEffect(() => {
    if (registered === 'true') {
      setShowRegisteredMessage(true);
    }
  }, [registered]);

  return (
    <div className="container mx-auto px-4 py-6">
      {showRegisteredMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6 max-w-md mx-auto">
          アカウント登録が完了しました。ログインしてください。
        </div>
      )}
      <LoginForm />
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-6">ロード中...</div>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
