import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: name,
                }
            }
        });

        if (signupError) {
            setError(signupError.message);
            setLoading(false);
        } else {
            if (data.session) {
                // If email confirmation is OFF, we get a session immediately
                navigate('/dashboard');
            } else {
                // If email confirmation is ON, we need to show a message
                setSuccess(true);
                setLoading(false);
            }
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white p-10 rounded-3xl border border-zinc-100 shadow-xl text-center"
                >
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Check your email!</h2>
                    <p className="text-zinc-500 mb-8 leading-relaxed">
                        We've sent a confirmation link to <span className="font-semibold text-zinc-900">{email}</span>. Click the link to start using Note.ai.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                    >
                        Go to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 w-full max-w-md"
            >
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl border border-zinc-100 shadow-xl"
            >
                <div className="text-center mb-8">
                    <div className="text-2xl font-bold tracking-tighter text-zinc-900 mb-2">Note.ai</div>
                    <p className="text-zinc-500">Create your account to start writing.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account? <Link to="/login" className="text-zinc-900 font-medium hover:underline">Sign in</Link>
                </div>
            </motion.div>
        </div>
    );
};
