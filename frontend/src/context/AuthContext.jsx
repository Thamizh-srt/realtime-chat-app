import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import axiosInstance, { setAccessToken, clearAccessToken } from '../api/axiosInstance';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    const refreshAuthState = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosInstance.post('/auth/refresh');
            setAccessToken(data.accessToken);
            setUser(data.user);
            setError(null);
        } catch (err) {
            // User is not authenticated - this is normal on first visit or after logout
            clearAccessToken();
            setUser(null);
            // Don't show error, just mark as not authenticated
            setError(null);
        } finally {
            setLoading(false);
            setIsInitialized(true);
        }
    }, []); 

    useEffect(() => {
        refreshAuthState();
    }, []); // Empty dependency array - runs only once on mount

    const register = useCallback(async(name,email,password)=>{
        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/auth/register',{name,email,password});
            setUser(data.user);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed!');
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    },[]);

    const login = useCallback(async(name,password)=>{
        try {
            setLoading(true);
            const {data} = await axiosInstance.post('/auth/login',{name,password});
            setUser(data.user);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed!');
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    },[])

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await axiosInstance.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearAccessToken();
            setUser(null);
            setLoading(false);
        }
    }, []);
    
    const value = useMemo(() => ({
        user,
        loading,
        isInitialized,
        error,
        refreshAuthState,
        register,
        login,
        logout
    }), [user, loading, isInitialized, error, refreshAuthState]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
