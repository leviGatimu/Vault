"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, FolderDot, Search, Star, ArrowRight, Sun, Moon, Sparkles, Shield } from "lucide-react";
import AdminLoginModal from "@/components/AdminLoginModal";

export default function LandingPage() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        setIsDark(root.classList.contains("dark"));
    };
    // Inside your LandingPage function, near the other state hooks
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Secret Shortcut: Alt + A (or Option + A on Mac)
            // This avoids the browser's native "Paste" shortcut
            if (e.altKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                setShowAdminLogin(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    return (
        <main className="relative min-h-screen bg-[#f8fafc] dark:bg-black selection:bg-black/20 dark:selection:bg-white/30 text-black dark:text-white font-sans overflow-hidden">

            {/* Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 dark:bg-purple-900/10 blur-[150px]" />
            </div>

            {/* 1. Header */}
            <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-2 glass-panel px-5 py-3 rounded-full pointer-events-auto backdrop-blur-3xl">
                    <Lock className="w-5 h-5 text-black dark:text-white" />
                    <span className="text-lg text-black dark:text-white font-medium tracking-wide">VAULT</span>
                </div>

                <div className="flex items-center gap-3 pointer-events-auto">
                    {mounted && (
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="glass-button p-3 rounded-full flex items-center justify-center"
                        >
                            <motion.div animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.5 }}>
                                {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
                            </motion.div>
                        </motion.button>
                    )}
                    <Link href="/request-demo" className="pointer-events-auto block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="glass-button px-6 py-3 rounded-full text-black dark:text-white font-medium text-sm flex items-center gap-2 group"
                        >
                            Request Demo
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </div>
            </header>

            {/* 2. Massive Hero Section */}
            <section className="relative min-h-[110vh] flex flex-col items-center justify-center z-10 text-center pt-20">
                <div className="max-w-5xl px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-flex items-center gap-2 glass-panel px-5 py-2 rounded-full mb-10 text-sm text-black/70 dark:text-white/70"
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Redefining personal security for iOS 26.</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-7xl md:text-[10rem] font-semibold tracking-tighter bg-gradient-to-b from-black to-black/30 dark:from-white dark:to-white/30 bg-clip-text text-transparent mb-8 leading-none"
                    >
                        Your life, <br /> secured.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-xl md:text-3xl text-black/50 dark:text-white/50 font-light tracking-wide max-w-2xl mx-auto mb-16"
                    >
                        Stop relying on junky browser saves. Categorize, search, and lock your digital life behind a master PIN.
                    </motion.p>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-12"
                >
                    <div className="w-[1px] h-16 bg-gradient-to-b from-black/50 dark:from-white/50 to-transparent mx-auto" />
                </motion.div>
            </section>

            {/* 3. The Problem Statement (Storytelling) */}
            <section className="relative z-10 py-40 px-6 max-w-6xl mx-auto border-t border-black/5 dark:border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">
                        Browsers were built for browsing. <br />
                        <span className="text-black/30 dark:text-white/30">Not for protecting your identity.</span>
                    </h2>
                    <p className="text-2xl text-black/50 dark:text-white/50 font-light leading-relaxed">
                        Your banking logins shouldn't sit next to a ten-year-old forum account. Vault gives you a pristine, categorized environment. True zero-knowledge architecture.
                    </p>
                </motion.div>
            </section>

            {/* 4. The Apple "Bento Box" Feature Grid (Now with AI) */}
            <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">

                    {/* Row 1, Col 1&2: Pro Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-2 glass-panel rounded-[3rem] p-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-4xl font-medium mb-4 z-10 relative">Pro Search</h3>
                        <p className="text-xl text-black/50 dark:text-white/50 font-light z-10 relative max-w-md">Hit <kbd className="font-mono bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md text-black/80 dark:text-white/80">CMD + K</kbd> to instantly find any credential without scrolling.</p>

                        <div className="absolute bottom-[-10%] right-[-5%] w-[80%] h-[60%] glass-panel rounded-t-3xl border-b-0 p-6 opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-[-10px]">
                            <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                                <Search className="w-6 h-6 text-black/50 dark:text-white/50" />
                                <div className="h-6 w-48 bg-black/10 dark:bg-white/10 rounded-md" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Row 1, Col 3: Categorize */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-panel rounded-[3rem] p-10 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div>
                            <FolderDot className="w-12 h-12 text-black/80 dark:text-white/80 mb-6" />
                            <h3 className="text-3xl font-medium mb-4">Categorize</h3>
                            <p className="text-black/50 dark:text-white/50 font-light">Work, Finance, Personal. Keep the junk separate.</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-4 py-2 rounded-full glass-panel text-xs text-black/70 dark:text-white/70">Finance</span>
                            <span className="px-4 py-2 rounded-full glass-panel text-xs text-black/70 dark:text-white/70">Social</span>
                            <span className="px-4 py-2 rounded-full glass-panel text-xs text-black/70 dark:text-white/70">Dev</span>
                        </div>
                    </motion.div>

                    {/* Row 2, Col 1: Zero Knowledge */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="glass-panel rounded-[3rem] p-10 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div>
                            <Shield className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-6" />
                            <h3 className="text-3xl font-medium mb-4">Zero Knowledge</h3>
                            <p className="text-black/50 dark:text-white/50 font-light relative z-10">Your master PIN never leaves your device. We can't see your data, even if we tried.</p>
                        </div>
                    </motion.div>

                    {/* Row 2, Col 2&3: Vault AI */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="md:col-span-2 glass-panel rounded-[3rem] p-12 relative overflow-hidden group flex flex-col justify-center"
                    >
                        {/* AI Glowing Orb Animation */}
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[60px] rounded-full pointer-events-none"
                        />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                <Sparkles className="w-4 h-4" />
                                <span>Coming Soon</span>
                            </div>
                            <h3 className="text-4xl font-medium mb-4">Vault AI</h3>
                            <p className="text-xl text-black/50 dark:text-white/50 font-light max-w-lg mb-8">
                                Your personal security analyst. Vault AI automatically identifies URLs and tags your credentials into smart folders. It actively monitors password health and warns you of weak points before breaches happen.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* 5. The 3 Steps Section */}
            <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto overflow-hidden border-t border-black/5 dark:border-white/5 mt-10">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-[30vw] h-[50vh] glass-panel rounded-full blur-[80px]"
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ left: `${i * 30}%`, top: "20%" }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-20 text-center">3 Simple Steps</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            className="glass-panel p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 space-y-8"
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 40 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="font-mono text-5xl text-black/20 dark:text-white/30">01</span>
                            <h3 className="text-3xl font-medium tracking-tight">Set Master PIN</h3>
                            <p className="text-lg text-black/50 dark:text-white/50 font-light leading-relaxed">Create a unique 4-digit PIN. Your app remains locked until this is entered.</p>
                        </motion.div>

                        <motion.div
                            className="glass-panel p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 space-y-8"
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 40 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                        >
                            <span className="font-mono text-5xl text-black/20 dark:text-white/30">02</span>
                            <h3 className="text-3xl font-medium tracking-tight">Save & Sort</h3>
                            <p className="text-lg text-black/50 dark:text-white/50 font-light leading-relaxed">Add your credentials. Let the AI tag them instantly to keep your vault heavily organized.</p>
                        </motion.div>

                        <motion.div
                            className="glass-panel p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 space-y-8"
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 40 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <span className="font-mono text-5xl text-black/20 dark:text-white/30">03</span>
                            <h3 className="text-3xl font-medium tracking-tight">Unlock & View</h3>
                            <p className="text-lg text-black/50 dark:text-white/50 font-light leading-relaxed">Search via CMD+K, click your item, and enter your PIN to reveal the password.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. Reviews / Social Proof */}
            <section className="relative z-10 py-32 px-6 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 text-center">Loved by early adopters.</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { text: "Finally, a password manager that doesn't feel like a spreadsheet from 2005. The glass UI is flawless.", author: "Sarah J.", role: "Product Designer" },
                            { text: "The Pro Search feature is ridiculous. CMD+K, type two letters, and my banking password is ready to copy.", author: "Marcus T.", role: "Full Stack Engineer" },
                            { text: "I love that it forces a 4-digit PIN to actually view the password. Gives me so much peace of mind.", author: "Elena R.", role: "Cybersecurity Analyst" }
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass-panel p-8 rounded-3xl"
                            >
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-black text-black dark:fill-white dark:text-white" />)}
                                </div>
                                <p className="text-lg text-black/80 dark:text-white/80 font-light mb-8">"{review.text}"</p>
                                <div>
                                    <p className="font-medium">{review.author}</p>
                                    <p className="text-sm text-black/40 dark:text-white/40">{review.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Final Call to Action */}
            <section className="relative z-10 py-40 px-6 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel rounded-[4rem] p-16 md:p-24 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-black/5 dark:bg-white/10 blur-[120px] rounded-full pointer-events-none" />

                    <Lock className="w-16 h-16 text-black dark:text-white mx-auto mb-8" />
                    <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-6">Ready to lock it down?</h2>
                    <p className="text-xl text-black/50 dark:text-white/50 font-light mb-12 max-w-xl mx-auto">
                        Vault is currently invite-only. Request a demo below and we'll send you an approval email to access the app.
                    </p>

                    <Link href="/request-demo" className="pointer-events-auto inline-block">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-button px-10 py-5 rounded-full text-black dark:text-white font-medium text-lg inline-flex items-center gap-3 group bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                        >
                            Request Demo
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* 8. Minimal Footer */}
            <footer className="relative z-10 border-t border-black/10 dark:border-white/10 py-12 px-12 flex flex-col md:flex-row justify-between items-center text-black/40 dark:text-white/40 text-sm">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium tracking-wide">VAULT</span>
                </div>
                <p>© 2026 Vault Inc. Crafted for perfection.</p>
                <div className="space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</a>
                </div>
            </footer>
            <AdminLoginModal
                isOpen={showAdminLogin}
                onClose={() => setShowAdminLogin(false)}
            />
        </main>
    );

}