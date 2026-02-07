'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { LoadingSpinner } from './components/feedback/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard, unauthenticated to login
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6">
        <LoadingSpinner size="lg" />
        <p className="text-base text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    </div>
  );
}