"use client";

import { useState, use } from "react"; // Note the new 'use' import
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShieldCheck, Copy, AlertTriangle, Loader2 } from "lucide-react";

// Params is now typed as a Promise
export default function BurnerSharePage({ params }: { params: Promise<{ id: string }> }) {
    // We unwrap the promise using React's use() hook
    const { id } = use(params);

    const [status, setStatus] = useState<"warning" | "loading" | "revealed" | "burned">("warning");
    const [data, setData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleReveal = async () => {
        setStatus("loading");
        try {
            // Now we pass the safely unwrapped ID
            const res = await fetch(`/api/share/${id}`);
            const payload = await res.json();

            if (!res.ok) {
                setErrorMessage(payload.error);
                setStatus("burned");
                return;
            }

            setData(payload);
            setStatus("revealed");
        } catch (error) {
            setErrorMessage("Secure connection failed.");
            setStatus("burned");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-red-500/5 blur-[150px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <AnimatePresence mode="wait">

                    {status === "warning" && (
                        <motion.div key="warning" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel border border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Flame className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-medium mb-2">Encrypted Transmission</h1>
                            <p className="text-white/50 text-sm mb-8 leading-relaxed">
                                You have been sent a secure, self-destructing credential. Once you click reveal, it will be permanently deleted from our servers. <strong>You can only view this once.</strong>
                            </p>
                            <button onClick={handleReveal} className="w-full bg-white text-black font-medium py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Decrypt & Reveal
                            </button>
                        </motion.div>
                    )}

                    {status === "loading" && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            <Loader2 className="w-10 h-10 text-white/50 animate-spin mx-auto mb-4" />
                            <p className="text-white/50 animate-pulse">Decrypting payload and scrubbing database...</p>
                        </motion.div>
                    )}

                    {status === "revealed" && data && (
                        <motion.div key="revealed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl p-8 rounded-3xl">
                            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-8 bg-emerald-500/10 py-2 rounded-full border border-emerald-500/20 text-sm font-medium">
                                <ShieldCheck className="w-4 h-4" /> Transmission Decrypted
                            </div>

                            <h2 className="text-xl font-medium text-center mb-6">{data.name}</h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-white/40 mb-1 px-1">Username / Email</p>
                                    <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl px-4 py-3">
                                        <span className="font-medium text-sm truncate mr-4">{data.username}</span>
                                        <button onClick={() => navigator.clipboard.writeText(data.username)} className="text-white/40 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 mb-1 px-1">Password</p>
                                    <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl px-4 py-3">
                                        <span className="font-mono tracking-widest text-sm text-emerald-400 truncate mr-4">{data.password}</span>
                                        <button onClick={() => navigator.clipboard.writeText(data.password)} className="text-white/40 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-xs text-white/30">This credential has been wiped from our servers. Save it now; if you refresh this page, it will be gone forever.</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "burned" && (
                        <motion.div key="burned" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-8 rounded-3xl text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-medium mb-2 text-red-400">Payload Destroyed</h2>
                            <p className="text-white/50 text-sm leading-relaxed">{errorMessage}</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
    );
}