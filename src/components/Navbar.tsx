import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-zinc-100/50">
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                <div className="text-xl md:text-2xl font-bold tracking-tighter text-zinc-900">
                    Note<span className="text-zinc-400">.ai</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-zinc-500">
                    <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
                    <a href="#about" className="hover:text-zinc-900 transition-colors">About</a>
                    <Link to="/login" className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-95">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-zinc-100 overflow-hidden shadow-xl"
                    >
                        <div className="flex flex-col gap-4 p-8 text-center text-lg font-bold text-zinc-900">
                            <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-zinc-500">Features</a>
                            <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-zinc-500">About</a>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="bg-zinc-900 text-white py-4 rounded-2xl shadow-xl shadow-zinc-200">
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
