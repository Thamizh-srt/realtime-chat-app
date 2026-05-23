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

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <AuthProvider>
                    <RoomProvider>
                        <App />
                    </RoomProvider>
                </AuthProvider>
            </Provider>
        </QueryClientProvider>
    </StrictMode>,
)
