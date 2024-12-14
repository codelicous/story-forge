import React, {
    createContext,
    useCallback,
    useEffect,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from 'react';
import {quickPlayPlayers} from '@components/app/consts.ts';
import {useLocation} from 'react-router-dom';

export type StoryEntry = { text: string, user: string, turn?: number };

export type Story = {
    entries: StoryEntry[];
    opener: string;
}
type GameConfig = Pick<Game, 'players' | 'openerCategory'>;

type GameContextProps = {
    isTriggered: boolean;
    setIsTriggered: Dispatch<SetStateAction<boolean>>;
    config: GameConfig;
    setConfig: Dispatch<SetStateAction<GameConfig>>;
    story: Story;
    setStory: (story: Story) => void;
    addEntry: (storyEntry: StoryEntry) => void;
    addOpener: (opener: string) => void;
    content: string
}

const GameContext = createContext<GameContextProps | null>(null);

type GameProps = { children?: ReactNode };

export const GameProvider: React.FC<GameProps> = ({children}) => {
    const [isTriggered, setIsTriggered] = useState(false);
    const location = useLocation();
    const [story, setStory] = useState<Story>({entries: [], opener: ''});
    const [content, setContent] = useState('');
    const addEntry = useCallback((storyEntry: StoryEntry) => {
        setStory({...story, entries: [...story.entries, storyEntry]});
    }, [story]);
    const getPlayers = useCallback((pathName: string) => pathName === '/quickplay' ? quickPlayPlayers : []
        , []);
    const addOpener = useCallback((opener: string) => {
        setStory({...story, opener});
    }, [story]);
    const [config, setConfig] = useState<GameConfig>({
        openerCategory: 'random',
        players: getPlayers(location.pathname)
    });

    useEffect(() => {
        setContent(`${story.opener} ${story.entries.reduce<string>((acc: string, currentValue: StoryEntry) =>
            acc.concat(' '+ currentValue.text), '')}`);
    }, [story]);

    const value = {
        isTriggered,
        story,
        addEntry,
        addOpener,
        content,
        config,
        setStory,
        setIsTriggered,
        setConfig
    };
    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within the context');
    }
    return context;
};
