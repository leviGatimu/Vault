"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Clock, CheckCircle, ArrowLeft, Loader2, Database, Mail, Sun, Moon } from "lucide-react";
import Link from "next/link";

type WaitlistUser = {
    id: string;
    email: string;
    createdAt: string;
    approved: boolean;
};

export default function AdminDashboard() {
    const [users, setUsers] = useState<WaitlistUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Initial Theme Check & Data Fetch
    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));

        fetch("/api/admin")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setIsLoading(false);
            });
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        setIsDark(root.classList.contains("dark"));
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const res = await fetch("/api/admin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, approved: true }),
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === id ? { ...u, approved: true } : u));
            }
        } catch (error) {
            console.error("Failed to approve user");
        }
        setProcessingId(null);
    };

    const totalRequests = users.length;
    const pendingRequests = users.filter((u) => !u.approved).length;
    const approvedRequests = users.filter((u) => u.approved).length;

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white font-sans overflow-hidden relative transition-colors duration-700">

            {/* 1. Ambient Glows (Matched to Landing Page) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 dark:bg-purple-900/10 blur-[150px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl px-8 py-5 flex justify-between items-center transition-colors duration-700">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 shadow-[0_0_20px_rgba(52,211,153,0.1)] transition-colors duration-700">
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="font-semibold tracking-wide text-lg text-black/90 dark:text-white/90">Vault Command</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-widest font-medium">Encrypted Session Live</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
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

                    <Link href="/">
                        <button className="glass-button px-5 py-2.5 rounded-xl text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Disconnect
                        </button>
                    </Link>
                </div>
            </header>

            <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">

                {/* HUD Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-black/50 dark:text-white/50 uppercase tracking-wider">Total Requests</h2>
                            <Users className="w-5 h-5 text-black/30 dark:text-white/30" />
                        </div>
                        <p className="text-5xl font-light tracking-tight">{totalRequests}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-amber-600/80 dark:text-amber-500/80 uppercase tracking-wider">Pending Queue</h2>
                            <Clock className="w-5 h-5 text-amber-500/50" />
                        </div>
                        <p className="text-5xl font-light tracking-tight text-amber-500 dark:text-amber-400">{pendingRequests}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-emerald-600/80 dark:text-emerald-500/80 uppercase tracking-wider">Approved Access</h2>
                            <CheckCircle className="w-5 h-5 text-emerald-500/50" />
                        </div>
                        <p className="text-5xl font-light tracking-tight text-emerald-600 dark:text-emerald-400">{approvedRequests}</p>
                    </motion.div>
                </div>

                {/* Data Table Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-3xl flex flex-col overflow-hidden"
                >
                    <div className="p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center transition-colors duration-700 bg-black/[0.01] dark:bg-white/[0.01]">
                        <div>
                            <h3 className="text-xl font-medium mb-1">Waitlist Ledger</h3>
                            <p className="text-sm text-black/40 dark:text-white/40 font-light">Manage and approve beta testers securely.</p>
                        </div>
                        <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            <Database className="w-5 h-5 text-black/50 dark:text-white/50" />
                        </div>
                    </div>

                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">User Identity (Email)</th>
                                    <th className="px-6 py-4 font-medium">Timestamp</th>
                                    <th className="px-6 py-4 font-medium">Clearance</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>

                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.tbody key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-500" />
                                                <p className="text-black/40 dark:text-white/40 font-medium">Decrypting database...</p>
                                            </td>
                                        </tr>
                                    </motion.tbody>
                                ) : users.length === 0 ? (
                                    <motion.tbody key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Mail className="w-10 h-10 text-black/20 dark:text-white/20" />
                                                </div>
                                                <p className="text-xl font-medium mb-2">The vault is quiet.</p>
                                                <p className="text-black/40 dark:text-white/40 font-light">No demo requests have been submitted yet.</p>
                                            </td>
                                        </tr>
                                    </motion.tbody>
                                ) : (
                                    <motion.tbody
                                        key="data"
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {users.map((user) => (
                                            <motion.tr
                                                variants={item}
                                                layout
                                                key={user.id}
                                                className={`border-b border-black/5 dark:border-white/5 transition-colors group ${user.approved ? 'opacity-50 hover:opacity-100' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`}
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-medium text-black/70 dark:text-white/70">
                                                            {user.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-black/90 dark:text-white/90">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-black/40 dark:text-white/40 text-sm font-mono">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.approved ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                                            Access Granted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                                                            Awaiting Review
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <AnimatePresence mode="popLayout">
                                                        {!user.approved && (
                                                            <motion.button
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleApprove(user.id)}
                                                                disabled={processingId === user.id}
                                                                className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 flex items-center justify-end gap-2 ml-auto"
                                                            >
                                                                {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve Access"}
                                                            </motion.button>
                                                        )}
                                                    </AnimatePresence>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                )}
                            </AnimatePresence>
                        </table>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}