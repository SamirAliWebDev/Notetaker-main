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
            <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-100 sticky top-0 z-50">
                <div className="text-xl font-bold tracking-tighter text-zinc-900">Note.ai</div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-500 hover:text-zinc-900">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar (Desktop & Mobile Overlay) */}
            <AnimatePresence>
                {(isMobileMenuOpen || !isMobileMenuOpen) && (
                    <div className={`${isMobileMenuOpen ? 'fixed inset-0 z-40 md:relative' : 'hidden md:flex'}`}>
                        {/* Mobile Overlay Backdrop */}
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute inset-0 bg-black/5 md:hidden"
                            />
                        )}

                        <Sidebar
                            isCollapsed={isCollapsed}
                            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                            onCloseMobile={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                )}
            </AnimatePresence>

            <main className={`flex-1 transition-all duration-300 p-4 md:p-10 ${isCollapsed ? 'md:pl-24' : 'md:pl-8'}`}>
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
