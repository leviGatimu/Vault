"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, ArrowLeft, Loader2, ShieldCheck, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        setIsDark(root.classList.contains("dark"));
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulating database verification delay
        setTimeout(() => {
            // For now, let's hardcode a success simulation
            // Later we will connect this to real authentication!
            if (pin.length === 4 && email.includes("@")) {
                setStatus("success");
                setTimeout(() => {
                    router.push("/vault"); // Takes them to the actual app
                }, 1500);
            } else {
                setStatus("error");
            }
        }, 1200);
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex flex-col relative overflow-hidden transition-colors duration-700">

            {/* Subtle Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/10 blur-[150px]" />
            </div>

            {/* Minimal Header */}
            <header className="relative z-10 p-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="flex items-center gap-4">
                    {mounted && (
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="glass-button p-2.5 rounded-xl flex items-center justify-center"
                        >
                            <motion.div animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.5 }}>
                                {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
                            </motion.div>
                        </motion.button>
                    )}
                </div>
            </header>

            {/* Centered Unlock Area */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md glass-panel p-10 md:p-12 rounded-[2.5rem] relative"
                >
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            // SUCCESS STATE (Unlocking)
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                                    >
                                        <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                    </motion.div>
                                </div>
                                <h2 className="text-2xl font-medium mb-2">Decryption Successful</h2>
                                <p className="text-black/50 dark:text-white/50 text-sm">Opening your vault...</p>
                            </motion.div>
                        ) : (
                            // LOGIN FORM STATE
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex justify-center mb-8">
                                    <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-inner">
                                        <Lock className="w-7 h-7 text-black/80 dark:text-white/80" />
                                    </div>
                                </div>

                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-medium tracking-tight mb-2">Unlock Vault</h1>
                                    <p className="text-black/50 dark:text-white/50 text-sm font-light">
                                        Enter your credentials and Master PIN to decrypt your data.
                                    </p>
                                </div>

                                <form onSubmit={handleUnlock} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Account Email"
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            required
                                            maxLength={4}
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Forces numbers only
                                            placeholder="••••"
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-center text-2xl tracking-[1em] placeholder:tracking-normal placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white font-mono"
                                        />
                                    </div>

                                    {status === "error" && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium text-center">
                                            Invalid credentials or PIN.
                                        </motion.p>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={status === "loading" || pin.length < 4 || !email}
                                        whileHover={status !== "loading" ? { scale: 1.02 } : {}}
                                        whileTap={status !== "loading" ? { scale: 0.98 } : {}}
                                        className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 mt-4"
                                    >
                                        {status === "loading" ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Decrypt & Enter
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </main>
    );
}