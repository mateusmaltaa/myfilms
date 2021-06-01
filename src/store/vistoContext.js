import React, { createContext, useState, useContext } from 'react';

const VistoContext = createContext();

export default function VistoProvider( { children } ){

    const [fv, setFv] = useState(0);

    return(
        <VistoContext.Provider value={{
            fv,
            setFv
         }}>
            {children}
        </VistoContext.Provider>
    )
}

export function useVisto() {
    const context = useContext(VistoContext);
    const { fv, setFv } = context;
    return { fv, setFv };
}