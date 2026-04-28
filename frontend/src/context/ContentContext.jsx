import React, { createContext, useState } from 'react';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const [sharedText, setSharedText] = useState('');

    const value = { sharedText, setSharedText };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
