import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);
    const [magicSent, setMagicSent] = useState(false);

    useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setVerified(true);
        }

        // Check if user is already logged in
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate('/dashboard');
        };
        checkUser();
    }, [searchParams, navigate]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error: loginError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (loginError) {
            setError(loginError.message);
            setLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: magicError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard`
            }
        });

        if (magicError) {
            setError(magicError.message);
            setLoading(false);
        } else {
            setMagicSent(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 w-full max-w-sm"
            >
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-2xl relative"
            >
                <div className="text-center mb-10">
                    <div className="text-3xl font-bold tracking-tighter text-zinc-900 mb-2">Note.ai</div>
                    <p className="text-zinc-500 font-medium">Think it. Note it. Done.</p>
                </div>

                {verified && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-semibold">Email verified! Signing you in...</span>
                    </div>
                )}

                {magicSent ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">Check your inbox</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                            We've sent a magic link to <span className="font-bold text-zinc-900">{email}</span>. One click and you're in.
                        </p>
                        <button onClick={() => setMagicSent(false)} className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
                            Try another email
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 py-3.5 rounded-2xl font-bold text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            {loading ? 'Connecting...' : 'Continue with Google'}
                        </button>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-zinc-100" />
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">or email</span>
                            <div className="flex-1 h-px bg-zinc-100" />
                        </div>

                        <form onSubmit={handleMagicLink} className="space-y-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-medium"
                            />
                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full bg-zinc-900 text-white py-3.5 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Continue with Email
                            </button>
                        </form>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl">
                        {error}
                    </div>
                )}
            </motion.div>

            <p className="mt-8 text-xs text-zinc-400 font-medium text-center">
                By signing in, you agree to our Terms of Service <br /> and Privacy Policy.
            </p>
        </div>
    );
};
