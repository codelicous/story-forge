import {useCallback} from 'react';
import {initGame} from '../../../api.ts';


export default function TestServer(): React.JSX.Element {
    const testGet = useCallback( async ()=>{
        const res = await fetch('/api');
        const json = await res.json();
        console.log(json);
    },[]);
    const testInit = useCallback(async ()=>{
        const res = await initGame({});
        console.log(res);
    },[initGame])
    return (
        <>  <button className='btn-active' onClick={testGet}>Init GamesTest</button>
            <button className='btn-active' onClick={testInit}>Init Game</button>
        </>);
}