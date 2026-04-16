"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, ShieldCheck, Search, ArrowRight, KeyRound, LayoutGrid } from "lucide-react";

export default function LandingPage() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end center"],
    });

    // Hero Shape Animations (Tied strictly to scroll position)
    const leftShapeX = useTransform(scrollYProgress, [0, 0.3], ["-50vw", "-10px"]);
    const rightShapeX = useTransform(scrollYProgress, [0, 0.3], ["50vw", "10px"]);
    const coreOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <main className="relative min-h-screen bg-black selection:bg-white/30 overflow-x-hidden" ref={containerRef}>

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/20 blur-[120px]" />
            </div>

            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex items-center gap-2 glass-panel px-5 py-3 rounded-full pointer-events-auto cursor-pointer"
                >
                    <Lock className="w-5 h-5 text-white" />
                    <span className="text-white font-medium tracking-wide">Vault</span>
                </motion.div>

                <motion.button
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="glass-button px-6 py-3 rounded-full text-white font-medium text-sm pointer-events-auto flex items-center gap-2 group"
                >
                    Request Demo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </nav>

            {/* 1. Hero Section */}
            <div className="relative h-screen w-full flex flex-col items-center justify-center z-10">
                <motion.div style={{ opacity: heroOpacity }} className="text-center px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-8 text-sm text-white/70"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Redefining personal security</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-medium tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-6"
                    >
                        Your life, <br /> secured.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/50 font-light tracking-wide"
                    >
                        Stop relying on cluttered browser managers. Categorize, search, and lock your digital life behind a master PIN.
                    </motion.p>
                </motion.div>

                {/* Floating Shapes that form the Lock */}
                <div className="absolute top-[65%] flex items-center justify-center">
                    <motion.div style={{ x: leftShapeX }} className="absolute w-32 h-48 glass-panel rounded-l-3xl rounded-r-md z-20" />
                    <motion.div style={{ x: rightShapeX }} className="absolute w-32 h-48 glass-panel rounded-r-3xl rounded-l-md z-20" />
                    <motion.div style={{ opacity: coreOpacity }} className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_60px_rgba(255,255,255,0.6)] z-30 flex items-center justify-center">
                        <KeyRound className="w-8 h-8 text-black" />
                    </motion.div>
                </div>
            </div>

            {/* 2. Storytelling / The Problem */}
            <section className="relative z-10 py-32 px-6 max-w-6xl mx-auto overflow-hidden">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Text slides in from the left when scrolled into view */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Built for clarity, <br /><span className="text-white/40">not clutter.</span></h2>
                        <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                            Google passwords get junky. Your banking logins are mixed with ten-year-old forum accounts. Vault gives you a pristine environment. Only you have the PIN. Only you have the access.
                        </p>
                    </motion.div>

                    {/* Glass Panel floats up from the bottom */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="glass-panel p-8 rounded-3xl aspect-square flex flex-col justify-center items-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                        <LayoutGrid className="w-24 h-24 text-white/20 group-hover:text-white/60 transition-colors duration-500 mb-6" />
                        <p className="text-white/80 font-medium text-xl">Categorized.</p>
                        <p className="text-white/40 text-center mt-2">Everything in its right place.</p>
                    </motion.div>
                </div>
            </section>

            {/* 3. Three Simple Steps */}
            <section className="relative z-10 py-32 px-6 max-w-6xl mx-auto border-t border-white/10">
                <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-medium mb-16 text-center"
                >
                    How it works
                </motion.h3>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="glass-panel p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                            <span className="font-mono text-white/50">01</span>
                        </div>
                        <h4 className="text-xl font-medium mb-3">Save & Organize</h4>
                        <p className="text-white/50 font-light text-sm">Drop your credentials in. Tag them by Work, Personal, Finance, or Social.</p>
                    </motion.div>

                    {/* Step 2 (Slightly longer delay to create a cascading effect) */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="glass-panel p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                            <span className="font-mono text-white/50">02</span>
                        </div>
                        <h4 className="text-xl font-medium mb-3">Pro Search</h4>
                        <p className="text-white/50 font-light text-sm">Hit CMD+K. Instantly find the exact password you need without scrolling through junk.</p>
                    </motion.div>

                    {/* Step 3 (Longest delay) */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="glass-panel p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                            <span className="font-mono text-white/50">03</span>
                        </div>
                        <h4 className="text-xl font-medium mb-3">PIN Unlock</h4>
                        <p className="text-white/50 font-light text-sm">No eye can see it until you enter your 4-digit master PIN. True zero-knowledge.</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-12 text-center text-white/30 text-sm">
                <p>© 2026 Vault. Crafted for perfection.</p>
            </footer>
        </main>
    );
}