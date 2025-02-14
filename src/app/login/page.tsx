import Button from "@/app/ui/button";

export default function Page(){
    return (<div className={'flex flex-row gap-4 items-end '}>
        <Button >Primary</Button>
        <Button variant={'cancel'}  >Primary</Button>
        <Button variant={'outline'}  >Primary</Button>
        <Button size={'small'} >Primary</Button>
        <Button size={'medium'} variant={'cancel'}  >Primary</Button>
        <Button size={'large'} variant={'outline'} disabled={true}  >Primary</Button>
    </div>)
}
