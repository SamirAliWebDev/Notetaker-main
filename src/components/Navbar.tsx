import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Workflow', href: '#workflow' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-zinc-100/50">
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between font-medium">
                <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter text-zinc-900 group">
                    Note<span className="text-zinc-400 group-hover:text-zinc-900 transition-colors">.ai</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-all hover:scale-105 active:scale-95"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-zinc-200" />
                    <Link
                        to="/login"
                        className="group flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-95"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 transition-colors border border-zinc-100 rounded-xl bg-white/50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOpen ? 'close' : 'menu'}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-zinc-900/10 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-20 left-6 right-6 bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-2xl z-50 md:hidden p-6"
                        >
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="py-4 px-6 rounded-2xl hover:bg-zinc-50 transition-all text-lg font-bold text-zinc-900 active:scale-95 text-center"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <div className="h-px bg-zinc-50 my-2" />
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-zinc-900 text-white py-4 rounded-2xl shadow-xl shadow-zinc-200 mt-2 active:scale-95 transition-all font-bold text-center flex items-center justify-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};
