import { useState } from 'react';
import { MessageSquare, UserPlus, LogIn } from 'lucide-react';
import { toast } from "react-toastify";
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { login, register, loading } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !password.trim()) return;
        if (!isLoginMode && !email.trim()) return;

        try {
            if (!isLoginMode) {
                await register(name, email, password);
                setIsLoginMode(true);
            } else {
                await login(name, password);
            }
            clearInput();
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || (isLoginMode ? 'Login failed' : 'Registration failed'));
        }
    };

    function clearInput (){
        setUsername('');
        setEmail('');
        setPassword('');
    }
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        clearInput();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 transition-colors duration-300">
            <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-border bg-white dark:bg-muted">
                <div className="p-8">
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MessageSquare className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {isLoginMode ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {isLoginMode
                                ? 'Enter your credentials to join the conversation'
                                : 'Sign up to start chatting with your friends'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="Choose a username..."
                                autoComplete="off"
                                autoFocus
                            />
                        </div>

                        {!isLoginMode && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required={!isLoginMode}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Enter your email..."
                                    autoComplete="off"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="Enter password..."
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim() || !password.trim() || (!isLoginMode && !email.trim())}
                            className="group relative mt-6 flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center gap-2">
                                {isLoginMode ? (
                                    <>
                                        <LogIn className="h-4 w-4" />
                                        Sign In
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Create Account
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="font-semibold text-primary hover:text-blue-600 hover:underline focus:outline-none"
                            >
                                {isLoginMode ? 'Register' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
