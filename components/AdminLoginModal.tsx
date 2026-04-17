"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [pin, setPin] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, let's use a hardcoded pin '1234'
        if (pin === "1234") {
            router.push("/admin");
        } else {
            alert("Invalid Access Code");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop Blur Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm glass-panel p-10 rounded-[2.5rem] border-white/20"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-medium mb-2">Vault Command</h2>
                            <p className="text-white/40 text-sm mb-8">Enter administrative access code</p>

                            <form onSubmit={handleLogin} className="w-full space-y-4">
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                    autoFocus
                                />
                                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                    Enter Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}