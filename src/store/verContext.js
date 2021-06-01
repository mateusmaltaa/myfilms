import React, { createContext, useState, useContext } from 'react';

const VerContext = createContext();

export default function VerProvider( { children } ){

    const [fpv, setFpv] = useState(0);

    return(
        <VerContext.Provider value={{
            fpv,
            setFpv
         }}>
            {children}
        </VerContext.Provider>
    )
}

export function useVer() {
    const context = useContext(VerContext);
    const { fpv, setFpv } = context;
    return { fpv, setFpv };
}