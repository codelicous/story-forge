import { Dialog } from '@components/app/dialog/dialog.tsx';

export type StartGameDialogProps = ChildProps & {
    startingPlayerName: string,
    triggerStartGame: () => void,
    isOpen: boolean
};

export function StartGameDialog({ className, startingPlayerName, triggerStartGame, isOpen }: StartGameDialogProps) {
    return <Dialog className={ className } isOpen={ isOpen }>
        <div className='flex flex-col align-middle p-9 rounded-lg bg-blue-500'>
        <div className="p-8">
            <div className='capitalize'> { startingPlayerName },</div>
            <div>You Start Our Story</div>
        </div>
        <button className='m-1 mt-6' onClick={ triggerStartGame }>Let's Start</button>
        </div>
    </Dialog>;

}
