import { Dialog } from '@components/app/dialog/dialog.tsx';

export type StartGameDialogProps = ChildProps & {
    startingPlayerName: string,
    triggerStartGame: () => void,
    isOpen: boolean
};

export function StartGameDialog({ className, startingPlayerName, triggerStartGame, isOpen }: StartGameDialogProps) {
    return <Dialog className={ className } isOpen={ isOpen }>
        <div>
            <div className='capitalize'> { startingPlayerName },</div>
            <div>You Start Our Story</div>
        </div>
        <button className='mt-6' onClick={ triggerStartGame }>Let's Start</button>
    </Dialog>;

}
