"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function RequestDemoPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to join waitlist");
            }

            setStatus("success");
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex flex-col relative overflow-hidden">

            {/* Subtle Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 dark:bg-purple-900/10 blur-[150px]" />
            </div>

            {/* Minimal Header */}
            <header className="relative z-10 p-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-black dark:text-white" />
                    <span className="text-lg font-medium tracking-wide">VAULT</span>
                </div>
            </header>

            {/* Centered Form Area */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md glass-panel p-10 md:p-12 rounded-[2.5rem] relative"
                >
                    {status === "success" ? (
                        // SUCCESS STATE
                        <motion.div
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
                                    <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                </motion.div>
                            </div>
                            <h2 className="text-3xl font-medium mb-4">You're on the list.</h2>
                            <p className="text-black/50 dark:text-white/50 mb-8">
                                We've secured your spot in line. We will email you at <span className="text-black dark:text-white font-medium">{email}</span> when your vault is ready.
                            </p>
                            <Link href="/" className="block w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full glass-button py-4 rounded-xl font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                                >
                                    Return to Homepage
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : (
                        // FORM STATE
                        <>
                            <div className="w-14 h-14 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10">
                                <Mail className="w-6 h-6 text-black/70 dark:text-white/70" />
                            </div>
                            <h1 className="text-3xl font-medium tracking-tight mb-3">Request Access</h1>
                            <p className="text-black/50 dark:text-white/50 mb-8 font-light">
                                Vault is currently in closed beta. Enter your email to secure your spot on the waitlist.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white"
                                    />
                                </div>

                                {status === "error" && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium px-1">
                                        {errorMessage}
                                    </motion.p>
                                )}

                                {/* THE UPGRADED PREMIUM BUTTON */}
                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    whileHover={status !== "loading" ? { scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.2)" } : {}}
                                    whileTap={status !== "loading" ? { scale: 0.97 } : {}}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-4 font-medium flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Submit Request
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <p className="text-center text-xs text-black/40 dark:text-white/40 mt-6">
                                By submitting, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </main>
    );
}