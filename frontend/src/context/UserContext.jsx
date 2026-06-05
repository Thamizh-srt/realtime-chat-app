import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const UserContext = createContext();

export const UserProvider = ({children})=>{

    const [users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUsers().then(() => setLoading(false));
        
    }, []);

    const getUsers = async()=>{
        const response = await axiosInstance.get('/users/get');
        setUsers(response.data.users)
    }




    return(
        <UserContext.Provider value={{users}}>
            {children}
        </UserContext.Provider>
    )
}