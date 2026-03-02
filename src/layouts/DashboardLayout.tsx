import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex bg-[#FAFAFA] min-h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row bg-[#FAFAFA] min-h-screen relative">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-lg border-b border-zinc-100 sticky top-0 z-50">
                <div className="text-xl font-bold tracking-tighter text-zinc-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
                    </div>
                    Note.ai
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-600 hover:text-zinc-900 border border-zinc-100 rounded-xl bg-white shadow-sm active:scale-90 transition-all">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isMobileMenuOpen ? 'close' : 'open'}
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </header>

            {/* Sidebar (Desktop & Mobile Overlay) */}
            <AnimatePresence>
                {(isMobileMenuOpen) && (
                    <div className="fixed inset-0 z-[60] md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 bg-zinc-900/10 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative h-full w-[280px]"
                        >
                            <Sidebar
                                isCollapsed={false}
                                onToggleCollapse={() => { }}
                                onCloseMobile={() => setIsMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (Always present there) */}
            <div className="hidden md:block">
                <Sidebar
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    onCloseMobile={() => { }}
                />
            </div>

            <main className={`flex-1 transition-all duration-500 overflow-x-hidden ${isCollapsed ? 'md:pl-[84px]' : 'md:pl-[280px]'}`}>
                <div className="p-4 md:p-10 max-w-6xl mx-auto w-full min-h-[calc(100vh-64px)] md:min-h-screen flex flex-col">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
