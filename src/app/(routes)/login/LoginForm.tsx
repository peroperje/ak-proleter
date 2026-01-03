'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
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
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

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

      <div className='relative my-2'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-white px-2 text-gray-500 dark:bg-neutral-900'>
            Or continue with
          </span>
        </div>
      </div>

      <button
        type='button'
        onClick={handleGoogleSignIn}
        className='flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
      >
        <FcGoogle size={20} />
        Google
      </button>

      <div className='mt-2 text-center text-sm text-gray-500 dark:text-gray-400'>
        <p>Demo accounts:</p>
        <p>admin@akproleter.rs / admin123</p>
        <p>coach@akproleter.rs / coach123</p>
      </div>
    </form>
  );
}
