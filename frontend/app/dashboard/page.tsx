'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-6">
          <LoadingSpinner size="lg" />
          <p className="text-base text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Welcome, {user?.username || 'User'}!
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              User ID: {user?.id}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={logout}
            size="sm"
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Your Tasks
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Manage your personal tasks efficiently with our task management system.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Quick Stats
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Track your productivity and task completion rates.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Manage Your Tasks
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
            Click the button below to access your task management interface where you can create, update, and track your tasks.
          </p>
          <Button
            onClick={() => router.push('/tasks')}
          >
            Go to Task Manager
          </Button>
        </div>
      </div>
    </div>
  );
}