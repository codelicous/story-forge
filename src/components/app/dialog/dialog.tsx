import {ReactNode, useEffect, useRef} from 'react';

export type DialogProps = ChildProps & { isOpen: boolean, children: ReactNode};

export function Dialog({ className, isOpen, children}: DialogProps): ReactNode {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if(isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close(); }
        }, [isOpen]);

    return <dialog ref={dialogRef}
                   className={`bg-gray-800 text-white text-2xl min-w-5 rounded-lg shadow-xl backdrop:bg-gray-900/50
     ${className || ''}` }> {children}</dialog>;
}
