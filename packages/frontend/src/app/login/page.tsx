'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);

  useEffect(() => {
    if (registered === 'true') {
      setShowRegisteredMessage(true);
    }
  }, [registered]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {showRegisteredMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-6 max-w-md mx-auto">
            アカウント登録が完了しました。ログインしてください。
          </div>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
