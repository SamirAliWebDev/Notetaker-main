import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, Share2, Settings, LogOut } from 'lucide-react';

const links = [
    { name: 'My Notes', path: '/dashboard', icon: Home },
    { name: 'Folders', path: '/dashboard/folders', icon: Folder },
    { name: 'Shared', path: '/dashboard/shared', icon: Share2 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-64 border-r border-zinc-100 h-screen flex flex-col bg-white sticky top-0">
            <div className="p-6">
                <div className="text-xl font-bold tracking-tighter text-zinc-900">Note.ai</div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-100">
                <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Logout
                </Link>
            </div>
        </div>
    );
};
