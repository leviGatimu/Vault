"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, ArrowLeft, Loader2, ShieldCheck, Sun, Moon, UserPlus, LogIn, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [totp, setTotp] = useState(""); // New 2FA State
    const [needs2FA, setNeeds2FA] = useState(false); // New trigger

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

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

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        if (mode === "register") {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, pin }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setStatus("error"); setErrorMessage(data.error || "Failed to register."); return;
                }
                const signInRes = await signIn("credentials", { email, pin, redirect: false });
                if (signInRes?.error) {
                    setStatus("error"); setErrorMessage("Account created, but auto-login failed.");
                } else {
                    setStatus("success"); setTimeout(() => router.push("/vault"), 1500);
                }
            } catch (error) {
                setStatus("error"); setErrorMessage("A network error occurred.");
            }
        } else {
            // === STANDARD LOGIN ===
            const res = await signIn("credentials", {
                email,
                pin,
                totp, // Send the 2FA code (it will be empty at first)
                redirect: false,
            });

            if (res?.error) {
                setStatus("error");
                // Catch the specific 2FA errors we threw from the backend
                if (res.error === "2FA_REQUIRED") {
                    setNeeds2FA(true);
                    setErrorMessage(""); // Clear errors, just show the 2FA screen
                } else if (res.error === "INVALID_2FA") {
                    setErrorMessage("Invalid Authenticator Code.");
                } else {
                    setErrorMessage("Invalid credentials or PIN.");
                }
            } else {
                setStatus("success");
                setTimeout(() => router.push("/vault"), 1500);
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex flex-col relative overflow-hidden transition-colors duration-700">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/10 blur-[150px]" />
            </div>

            <header className="relative z-10 p-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="flex items-center gap-4">
                    {mounted && (
                        <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="glass-button p-2.5 rounded-xl flex items-center justify-center">
                            <motion.div animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.5 }}>{isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}</motion.div>
                        </motion.button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md glass-panel p-10 md:p-12 rounded-[2.5rem] relative">
                    <AnimatePresence mode="wait">

                        {status === "success" ? (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}><ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" /></motion.div></div>
                                <h2 className="text-2xl font-medium mb-2">Decryption Successful</h2>
                                <p className="text-black/50 dark:text-white/50 text-sm">Opening your vault...</p>
                            </motion.div>
                        ) : needs2FA ? (

                            /* === NEW 2FA CHALLENGE SCREEN === */
                            <motion.div key="2fa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                                        <Smartphone className="w-7 h-7 text-blue-500" />
                                    </div>
                                </div>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-medium tracking-tight mb-2">Two-Factor Auth</h1>
                                    <p className="text-black/50 dark:text-white/50 text-sm font-light">Open your Authenticator app and enter the 6-digit code.</p>
                                </div>
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div>
                                        <input
                                            type="text" required maxLength={6} value={totp} onChange={(e) => setTotp(e.target.value.replace(/\D/g, ''))} placeholder="000000"
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center text-3xl tracking-[0.5em] text-black dark:text-white font-mono"
                                        />
                                    </div>
                                    {status === "error" && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{errorMessage}</motion.p>)}
                                    <motion.button type="submit" disabled={status === "loading" || totp.length < 6} className="w-full bg-blue-500 text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-blue-500/20">
                                        {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify Identity <ArrowRight className="w-4 h-4" /></>}
                                    </motion.button>
                                    <button type="button" onClick={() => { setNeeds2FA(false); setStatus("idle"); setErrorMessage(""); }} className="w-full mt-4 text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">Go Back</button>
                                </form>
                            </motion.div>

                        ) : (

                            /* === STANDARD LOGIN / REGISTER SCREEN === */
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl mb-8">
                                    <button onClick={() => { setMode("login"); setErrorMessage(""); }} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === "login" ? "bg-white dark:bg-black shadow-sm text-black dark:text-white" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"}`}><LogIn className="w-4 h-4" /> Sign In</button>
                                    <button onClick={() => { setMode("register"); setErrorMessage(""); }} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === "register" ? "bg-white dark:bg-black shadow-sm text-black dark:text-white" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"}`}><UserPlus className="w-4 h-4" /> Initialize</button>
                                </div>
                                <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-inner"><Lock className="w-7 h-7 text-black/80 dark:text-white/80" /></div></div>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-medium tracking-tight mb-2">{mode === "login" ? "Unlock Vault" : "Initialize Vault"}</h1>
                                    <p className="text-black/50 dark:text-white/50 text-sm font-light">{mode === "login" ? "Enter your credentials and Master PIN." : "Create your 4-digit Master PIN. Do not lose this."}</p>
                                </div>
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Account Email" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-black dark:text-white" /></div>
                                    <div><input type="password" required maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-center text-2xl tracking-[1em] text-black dark:text-white font-mono" /></div>
                                    {status === "error" && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{errorMessage}</motion.p>)}
                                    <motion.button type="submit" disabled={status === "loading" || pin.length < 4 || !email} className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 mt-4">
                                        {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{mode === "login" ? "Decrypt & Enter" : "Create Master PIN"}<ArrowRight className="w-4 h-4" /></>}
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