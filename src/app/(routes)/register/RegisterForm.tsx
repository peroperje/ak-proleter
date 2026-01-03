'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import Button from '@/app/ui/button';
import InputField from '@/app/ui/input-field';
import { register } from '@/app/lib/actions';

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(register, null);

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <form action={formAction} className='flex flex-col gap-4'>
            {state?.message && !state?.success && (
                <div className='rounded border border-red-400 bg-red-100 p-3 text-red-700'>
                    {state.message}
                </div>
            )}

            {state?.success && (
                <div className='rounded border border-green-400 bg-green-100 p-3 text-green-700'>
                    {state.message}{' '}
                    <Link href="/login" className="font-bold underline">
                        Go to Login
                    </Link>
                </div>
            )}

            <InputField
                type='text'
                name='name'
                title='Name'
                placeholder='Enter your full name'
                required
                error={state?.errors?.name?.[0]}
            />

            <InputField
                type='email'
                name='email'
                title='Email'
                placeholder='name@example.com'
                required
                error={state?.errors?.email?.[0]}
            />

            <InputField
                type='password'
                name='password'
                title='Password'
                placeholder='••••••••'
                required
                error={state?.errors?.password?.[0]}
            />

            <InputField
                type='password'
                name='confirmPassword'
                title='Confirm Password'
                placeholder='••••••••'
                required
                error={state?.errors?.confirmPassword?.[0]}
            />

            <Button variant='submit' type='submit' disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create account'}
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
                Already have an account?{' '}
                <Link
                    href='/login'
                    className='font-medium text-teal-600 hover:text-teal-500 dark:text-teal-500'
                >
                    Login
                </Link>
            </div>
        </form>
    );
}
