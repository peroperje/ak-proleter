import Button from '@/app/ui/button';
import InputField from '@/app/ui/input-field';
import Box from '@/app/views/Box';

export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">

        <Box title={'Login'}>
          <form className={'flex flex-col gap-4'}>
            <InputField
              type={'email'}
              name={'email'}
              title={'Email'}
            />
            <InputField
              type={'password'}
              name={'password'}
              title={'Password'}
            />
            <Button
              variant="submit"
              type={'submit'}
            >
              Login
            </Button>
          </form>
        </Box>
      </div>
    </main>
  );
}
