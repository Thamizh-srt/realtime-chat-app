import React, {useCallback,useEffect,useState, createContext} from "react";
import axiosInstance,{setAccessToken, clearAccessToken} from "../api/axiosInstance";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(()=>{
        refreshAuthState();
    },[]);

    const refreshAuthState = useCallback(async()=>{
        try {
            setLoading(true);
            const {data} = await axiosInstance.post('auth/refresh');
            setAccessToken(data.accessToken);
            
            const {userData} = await axiosInstance.post('/profile');
            setUser(userData);
            setError(null);
        } catch (error) {
            clearAccessToken();
            setUser(null);
            setError('Not authenticated');
        } finally {
            setLoading(false);
            setIsInitialized(true);
        }

    },[]);

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


    return (
        <AuthContext.Provider value={{ user, loading, error, isInitialized, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}