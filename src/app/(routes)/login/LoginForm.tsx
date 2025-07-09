'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/ui/button';
import InputField from '@/app/ui/input-field';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // In a real app, you would store the token in localStorage or cookies
      // and set up a global auth state

      // For demo purposes, we'll just redirect to the dashboard
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      {error && (
        <div className='rounded border border-red-400 bg-red-100 p-3 text-red-700'>
          {error}
        </div>
      )}

      <InputField
        type='email'
        name='email'
        title='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <InputField
        type='password'
        name='password'
        title='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button variant='submit' type='submit' disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <div className='mt-2 text-center text-sm text-gray-500 dark:text-gray-400'>
        <p>Demo accounts:</p>
        <p>admin@akproleter.rs / admin123</p>
        <p>coach@akproleter.rs / coach123</p>
      </div>
    </form>
  );
}
