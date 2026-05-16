import { useAuth } from "../hooks/useAuth";
import Login from "../components/Login";

export default  function ProtectedRoute({children}){
    const {user, loading, isInitialized} = useAuth();

    if(!isInitialized || loading){
        return <div>Loading...</div>
    }

    if(!user){
        return <Login />;
    }

    return children;
}