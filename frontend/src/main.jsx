import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import store from './app/store';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { RoomProvider } from './context/RoomContext';
import {MessageProvider} from './context/MessageContext';
import { UserProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <AuthProvider>
                    <RoomProvider>
                        <UserProvider>
                            <MessageProvider>
                                <App />
                            </MessageProvider>
                        </UserProvider>
                    </RoomProvider>
                </AuthProvider>
            </Provider>
        </QueryClientProvider>
    </StrictMode>,
)
