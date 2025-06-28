import { Dialog } from '@components/app/dialog/dialog.tsx';

export type StartGameDialogProps = ChildProps & {
    startingPlayerName: string,
    triggerStartGame: () => void,
    isOpen: boolean
};

export function StartGameDialog({ className, startingPlayerName, triggerStartGame, isOpen }: StartGameDialogProps) {
    return <Dialog className={ className } isOpen={ isOpen }>
        <div className='flex flex-col align-middle items-center p-8 rounded-xl bg-gray-800 border border-amber-500/30 shadow-2xl max-w-md mx-auto'>
            {/* Header with medieval styling */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-medieval text-amber-500 mb-2">
                    The Tale Begins
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
            </div>

            {/* Main content */}
            <div className="text-center mb-8 bg-gray-700/30 rounded-lg p-6 w-full">
                <div className="text-amber-300 text-lg mb-2">
                    <span className='capitalize text-amber-400 font-bold'>{ startingPlayerName }</span>,
                </div>
                <div className="text-amber-200 text-base">
                    You have the honor of starting our story
                </div>
                <div className="text-amber-400/60 text-sm mt-3 italic">
                    Choose your words wisely...
                </div>
            </div>

            {/* Action button */}
            <button 
                className='w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25 transition-all duration-200'
                onClick={ triggerStartGame }
            >
                Begin the Adventure
            </button>
        </div>

        {/* Add medieval font styles */}
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
            
            .font-medieval {
                font-family: 'MedievalSharp', cursive;
            }
        `}</style>
    </Dialog>;

}
