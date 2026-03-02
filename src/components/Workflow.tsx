import { motion } from 'framer-motion';
import { PenLine, Sparkles, Folders } from 'lucide-react';

const steps = [
    {
        title: "Just Start Writing",
        description: "Capture your ideas without worrying about where they belong. Our editor stays out of your way.",
        icon: <PenLine className="w-6 h-6" />,
        color: "bg-blue-500"
    },
    {
        title: "AI Analysis",
        description: "Our Groq-powered brain reads your content in milliseconds, identifying key topics and intent.",
        icon: <Sparkles className="w-6 h-6" />,
        color: "bg-purple-500"
    },
    {
        title: "Instant Organization",
        description: "Notes are automatically filed into smart folders. No more manual sorting, ever.",
        icon: <Folders className="w-6 h-6" />,
        color: "bg-zinc-900"
    }
];

export const Workflow = () => {
    return (
        <section id="workflow" className="py-20 px-6 bg-zinc-50/50 border-y border-zinc-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tightest mb-4">How it works</h2>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Experience the magic of effortless organization.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connection line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-zinc-100 -z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-xl mb-8 active:scale-95 transition-transform`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                            <p className="text-zinc-500 leading-relaxed px-4">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
