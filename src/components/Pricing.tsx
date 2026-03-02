import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingPlans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for students and casual writers.",
        features: ["100 Notes", "Basic AI Sorting", "All Devices Sync"],
        button: "Get Started",
        pro: false
    },
    {
        name: "Professional",
        price: "$12",
        description: "For creators who want total organization.",
        features: ["Unlimited Notes", "Advanced Context Analysis", "Shared Workspace", "Priority Support"],
        button: "Try Pro Free",
        pro: true
    },
    {
        name: "Organization",
        price: "Contact",
        description: "For teams shipping ideas fast.",
        features: ["Enterprise Admin", "Custom AI Models", "Audit Logs", "SAML SSO"],
        button: "Contact Sales",
        pro: false
    }
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase bg-zinc-50 px-3 py-1 rounded-full mb-4 inline-block">Pricing Plans</span>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tightest mt-2">Pick your power.</h2>
                    <p className="text-zinc-500 text-lg mt-4 max-w-2xl mx-auto">Flexible plans for thinkers of all kinds.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className={`p-10 rounded-3xl border ${plan.pro ? 'border-zinc-900 bg-zinc-950 text-white shadow-2xl relative' : 'border-zinc-100 bg-zinc-50/30'} flex flex-col justify-between hover:scale-[1.02] transition-all`}
                        >
                            {plan.pro && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-zinc-100 text-zinc-950 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xl">
                                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                                </div>
                            )}

                            <div>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className={`text-sm mb-6 ${plan.pro ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.description}</p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter">{plan.price}</span>
                                    {plan.price !== "Contact" && <span className={`text-sm ${plan.pro ? 'text-zinc-400' : 'text-zinc-500'}`}>/mo</span>}
                                </div>
                                <div className="space-y-4 mb-10">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.pro ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                                                <Check className={`w-3 h-3 ${plan.pro ? 'text-zinc-100' : 'text-zinc-900'}`} />
                                            </div>
                                            <span className={`text-sm font-medium ${plan.pro ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link
                                to={plan.name === "Organization" ? "#contact" : "/login"}
                                className={`w-full py-4 rounded-2xl text-center text-sm font-bold transition-all active:scale-95 ${plan.pro
                                    ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                                    : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                            >
                                {plan.button}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
