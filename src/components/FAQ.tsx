import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
    {
        question: "How does the AI auto-sorting work?",
        answer: "We use Groq's high-speed inference with Llamas-3 models to analyze the semantic meaning of your notes. It compares the content against your existing folder structure and suggests the best fit instantly."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we use Supabase for enterprise-grade security. Your data is encrypted at rest and in transit. Only you have access to your personal notes."
    },
    {
        question: "Can I use it on multiple devices?",
        answer: "Absolutely. Note.ai is a cloud-based web app built with Vite. It's fully responsive and syncs your data in real-time across your phone, tablet, and desktop."
    },
    {
        question: "What happens if the AI sorts a note incorrectly?",
        answer: "You can always move notes between folders manually. The AI learns from your manual moves to improve its future suggestions for your specific writing style."
    },
    {
        question: "Is there an offline mode?",
        answer: "Currently, Note.ai requires an internet connection for real-time AI processing and Supabase syncing. We are working on a local-first caching layer for future updates."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 px-6 bg-zinc-50/50">
            <div className="max-w-px-3xl mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tightest mb-4">Frequently Asked Questions</h2>
                    <p className="text-zinc-500 text-lg">Everything you need to know about Note.ai.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`border border-zinc-100 rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-xl shadow-zinc-200/50' : 'bg-white/50 hover:bg-white'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="text-lg font-bold text-zinc-900 pr-8">{faq.question}</span>
                                    <div className={`p-2 rounded-xl border border-zinc-100 transition-all ${isOpen ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-400 group-hover:text-zinc-900'}`}>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 45 : 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-8 text-zinc-500 leading-relaxed text-base">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
