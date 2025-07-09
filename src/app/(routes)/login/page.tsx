import Box from '@/app/components/Box';
import LoginForm from './LoginForm';
import Logo from '@/app/components/Logo';

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center bg-gray-50 md:h-screen dark:bg-neutral-800'>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        <div className='mb-4 flex justify-center'>
          <Logo />
        </div>

        <Box title={'Login'}>
          <LoginForm />
        </Box>
      </div>
    </main>
  );
}
