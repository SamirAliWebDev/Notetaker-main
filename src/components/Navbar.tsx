import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="text-xl font-bold tracking-tighter text-zinc-900">
                    Note<span className="text-zinc-400">.ai</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
                    <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
                    <a href="#about" className="hover:text-zinc-900 transition-colors">About</a>
                </div>

                <Link to="/login" className="bg-zinc-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                    Get Started
                </Link>
            </div>
        </nav>
    );
};
