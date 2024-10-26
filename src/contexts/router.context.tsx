import React, {createContext, useContext} from 'react';
import {Params, useLocation, useParams} from 'react-router-dom';
import type {Location} from '@remix-run/router';

type RouteContextProps = {location: Location, params: Params};
const RouteContext = createContext<RouteContextProps | Record<string, never> >({});

export const RouteProvider = ({children}: {children: React.JSX.Element}) => {
    const location = useLocation();
    const params = useParams();
    return (
        <RouteContext.Provider value={{location, params}}>
            {children}
        </RouteContext.Provider>
    );
};

export const useRouteContext = () => useContext(RouteContext);