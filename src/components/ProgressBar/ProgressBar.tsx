import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({percentage, color, animated = false, animationKey}: { 
    percentage: number, 
    color: string | undefined,
    animated?: boolean,
    animationKey?: string | number
}): React.JSX.Element {
    // Safelist classes for Tailwind CSS v4: bg-amber-400 bg-red-500 bg-lime-500 bg-fuchsia-600 bg-violet-500

    return (
        <div className={`${['container']} w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700`}>
            <div 
                key={animationKey}
                className={`bg-${color} h-1.5 rounded-full ${
                    animated ? 'progress-bar-animated' : 'progress-bar'
                }`}
                style={animated ? {} : {width: `${percentage}%`}}>
            </div>
        </div>
    );
}