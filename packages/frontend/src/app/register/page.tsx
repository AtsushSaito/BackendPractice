'use client';

import Navbar from '../components/Navbar';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <RegisterForm />
      </div>
    </main>
  );
}
