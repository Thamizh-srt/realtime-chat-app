import { createContext, useMemo, useState } from 'react';

export const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const value = useMemo(() => ({
        messages,
        setMessages,
    }), [messages]);

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};