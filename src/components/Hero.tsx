import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 leading-[1.1]"
                >
                    Your notes, organized by <span className="bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 bg-clip-text text-transparent">intelligence</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-xl text-zinc-500 max-w-2xl mx-auto mt-8 leading-relaxed"
                >
                    The first note-taker that understands you. Write your thoughts, and our AI automatically files them into the right folders.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/login" className="bg-zinc-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-zinc-800 transition-all shadow-lg hover:shadow-zinc-200">
                        Start writing for free
                    </Link>
                    <button className="bg-transparent border border-zinc-200 text-zinc-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-zinc-50 transition-all">
                        Watch the demo
                    </button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-20 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-full" />
                    <img
                        src="/dashboard.png"
                        alt="Note.ai Dashboard"
                        className="rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-5xl mx-auto"
                    />
                </motion.div>
            </div>
        </section>
    );
};
