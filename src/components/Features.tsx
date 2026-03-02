import { motion } from 'framer-motion';
import { Brain, FileText, Zap } from 'lucide-react';

const features = [
    {
        title: "AI Auto-Sorting",
        description: "Groq-powered intelligence that understands your context and files notes into the perfect folders automatically.",
        icon: <Brain className="w-6 h-6 text-zinc-900" />,
        className: "md:col-span-2"
    },
    {
        title: "Vite-Fast",
        description: "Instant load times and real-time syncing across all your devices.",
        icon: <Zap className="w-6 h-6 text-zinc-900" />,
        className: "md:col-span-1"
    },
    {
        title: "Rich Text",
        description: "Full Tiptap integration for professional formatting, code blocks, and markdown support.",
        icon: <FileText className="w-6 h-6 text-zinc-900" />,
        className: "md:col-span-3"
    }
];

export const Features = () => {
    return (
        <section id="features" className="py-16 md:py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`bento-card flex flex-col justify-between min-h-[260px] md:min-h-[300px] ${feature.className}`}
                        >
                            <div>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-50 flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                                <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-md">{feature.description}</p>
                            </div>
                            <div className="mt-8">
                                <div className="h-1 w-24 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-zinc-900 w-1/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
