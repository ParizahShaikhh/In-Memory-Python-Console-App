'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/feedback/Alert';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const success = await signup(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Failed to create account. Username may already exist.');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          Create Account
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Sign up to start managing your tasks
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
            placeholder="Choose a username"
            disabled={loading}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password (min. 6 characters)"
            disabled={loading}
            autoComplete="new-password"
            helperText="Password must be at least 6 characters"
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            disabled={loading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}