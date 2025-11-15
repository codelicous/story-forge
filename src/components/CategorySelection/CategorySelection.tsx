import React from 'react';
import openings from '@assets/openings.json';
import funnyIcon from '@assets/category-icons/funny.svg';
import mysteryIcon from '@assets/category-icons/mystery.svg';
import randomIcon from '@assets/category-icons/random.svg';

const categories = Object.keys(openings);

const categoryIcons: Record<string, React.JSX.Element> = {
    funny: (
        <img
            src={ funnyIcon }
            alt="Funny"
            className="w-7 h-7"
            style={ {
                filter: 'brightness(0) saturate(100%) invert(69%) sepia(56%) saturate(434%) hue-rotate(4deg) brightness(99%) contrast(92%)',
                transform: 'scale(0.9)',
                strokeWidth: '0.5px'
            } }
        />
    ),
    mystery: (
        <img
            src={ mysteryIcon }
            alt="Mystery"
            className="w-8 h-8"
            style={ {
                filter: 'brightness(0) saturate(100%) invert(69%) sepia(56%) saturate(434%) hue-rotate(4deg) brightness(99%) contrast(92%)',
                strokeWidth: '2px'
            } }
        />
    ),
    random: (
        <img
            src={ randomIcon }
            alt="Random"
            className="w-8 h-8"
            style={ {
                filter: 'brightness(0) saturate(100%) invert(69%) sepia(56%) saturate(434%) hue-rotate(4deg) brightness(99%) contrast(92%)',
                strokeWidth: '2px'
            } }
        />
    )
};

interface CategorySelectionProps {
    selectedCategory: string;
    onChange: (category: string) => void;
}

export const CategorySelection = ({ selectedCategory, onChange }: CategorySelectionProps): React.JSX.Element => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-amber-500 mb-4">
                Choose a Story Theme
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                { categories.map((category) => (
                    <label
                        key={ category }
                        className={ `
                            flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                            ${ selectedCategory === category
                            ? 'bg-amber-600/20 border-2 border-amber-500'
                            : 'bg-gray-700/50 border-2 border-transparent hover:border-amber-500/50' }
                        ` }
                    >
                        <input
                            checked={ selectedCategory === category }
                            onChange={ handleChange }
                            type="radio"
                            name="category"
                            value={ category }
                            className="radio h-5 w-5 text-amber-500 bg-gray-700 border-amber-500 checked:bg-amber-500 checked:shadow-[0_0_0_4px_#2e2e2e_inset,_0_0_0_4px_#2e2e2e_inset] hidden"
                        />
                        <div className={ `w-5 h-5 rounded-full mr-3 border-2 flex items-center justify-center
                            ${ selectedCategory === category
                            ? 'border-amber-500 bg-gray-800'
                            : 'border-amber-500/50 bg-transparent' }
                        ` }>
                            { selectedCategory === category && (
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                            ) }
                        </div>
                        <div className="flex items-center space-x-2">
                            { categoryIcons[category] }
                            <span className="text-amber-400 capitalize">{ category }</span>
                        </div>
                    </label>
                )) }
            </div>
        </div>
    );
};