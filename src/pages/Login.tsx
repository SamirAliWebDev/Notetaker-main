import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, Lock, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setVerified(true);
        }

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate('/dashboard');
        };
        checkUser();
    }, [searchParams, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 w-full max-w-md"
            >
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="text-3xl font-bold tracking-tighter text-zinc-900 mb-2">Note.ai</div>
                    <p className="text-zinc-500 font-medium">Welcome back. Enter your details to continue.</p>
                </div>

                {verified && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-semibold">Email verified! Signing you in...</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700 ml-1 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-zinc-400" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700 ml-1 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-zinc-400" />
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-medium"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500 font-medium">
                    New to Note.ai? <Link to="/signup" className="text-zinc-900 font-bold hover:underline">Create an account</Link>
                </div>
            </motion.div>
        </div>
    );
};
