import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, Share2, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const links = [
    { name: 'My Notes', path: '/dashboard', icon: Home },
    { name: 'Folders', path: '/dashboard/folders', icon: Folder },
    { name: 'Shared', path: '/dashboard/shared', icon: Share2 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
}

export const Sidebar = ({ isCollapsed, onToggleCollapse, onCloseMobile }: SidebarProps) => {
    const location = useLocation();

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? 84 : 280 }}
            className="fixed md:sticky top-0 left-0 bg-white border-r border-zinc-100 h-screen flex flex-col z-50 shadow-2xl md:shadow-none transition-all duration-300 overflow-hidden"
        >
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold tracking-tighter text-zinc-900"
                    >
                        Note.ai
                    </motion.div>
                )}
                <button
                    onClick={onToggleCollapse}
                    className="p-2 rounded-xl hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors hidden md:block"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1.5 mt-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={onCloseMobile}
                            className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all group relative ${isActive
                                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200'
                                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="whitespace-nowrap"
                                >
                                    {link.name}
                                </motion.span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {link.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={`p-4 border-t border-zinc-50 space-y-2 ${isCollapsed ? 'items-center' : ''}`}>
                <Link
                    to="/"
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-semibold text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group`}
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    {!isCollapsed && <span>Logout</span>}
                </Link>
            </div>
        </motion.div>
    );
};
