'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/feedback/Alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          Welcome Back
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Sign in to your account to continue
        </p>

        {error && (
          <div className="mb-4">
            <Alert variant="error" message={error} onDismiss={() => setError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
            disabled={loading}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            disabled={loading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}