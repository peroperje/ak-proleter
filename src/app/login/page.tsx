import Button from '@/app/ui/button';
import InputField from '@/app/ui/input-field';

export default function Page() {
  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-row items-end gap-4'}>
        <Button>
            Primary
                </Button>
        <Button variant={'cancel'}>Primary</Button>
        <Button variant={'outline'}>Primary</Button>
        <Button size={'small'}>Primary</Button>
        <Button size={'medium'} variant={'cancel'}>
          Primary
        </Button>
        <Button size={'large'} variant={'outline'} disabled={true}>
          Primary
        </Button>
      </div>
      <InputField title={'Email'} name={'email'}  />
    </div>
  );
}
