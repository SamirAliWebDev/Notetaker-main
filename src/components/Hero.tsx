import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section id="home" className="pt-24 sm:pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-[2.5rem] sm:text-5xl md:text-7xl font-extrabold tracking-tightest text-zinc-900 leading-[1.05] sm:leading-[1.1] md:leading-[1.1]"
                >
                    Your notes, organized by <span className="bg-gradient-to-r from-zinc-900 via-zinc-400 to-zinc-900 bg-clip-text text-transparent">intelligence</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mt-6 sm:mt-8 leading-relaxed px-4 sm:px-0"
                >
                    The first note-taker that understands you. Write your thoughts, and our AI automatically files them into the right folders.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0"
                >
                    <Link to="/login" className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-zinc-200 active:scale-95 text-center">
                        Start writing for free
                    </Link>
                    <button className="w-full sm:w-auto bg-white border border-zinc-200 text-zinc-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-zinc-50 transition-all active:scale-95 shadow-sm text-center">
                        Watch the demo
                    </button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-16 sm:mt-20 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-full" />
                    <img
                        src="/dashboard.png"
                        alt="Note.ai Dashboard"
                        className="rounded-2xl sm:rounded-3xl border border-zinc-100 shadow-2xl w-full max-w-5xl mx-auto relative z-0"
                    />
                </motion.div>
            </div>
        </section>
    );
};
