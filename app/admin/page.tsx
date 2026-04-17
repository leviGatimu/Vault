"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ShieldAlert, Video, Activity, Lock,
    Search, CheckCircle, XCircle, Plus, Upload,
    Trash2, Terminal, AlertTriangle, ArrowRight,
    Sun, Moon, ShieldCheck, Database, Server, Clock, LogOut, Loader2
} from "lucide-react";
import Link from "next/link";

// Simulated Data to fill the UI
const AUDIT_LOGS = [
    { id: 1, action: "Failed decryption attempt blocked", ip: "192.168.1.45", time: "2 mins ago", level: "warn" },
    { id: 2, action: "New user initialized vault", ip: "10.0.0.12", time: "14 mins ago", level: "info" },
    { id: 3, action: "Admin session authenticated", ip: "127.0.0.1", time: "1 hour ago", level: "secure" },
    { id: 4, action: "Database backup completed", ip: "Internal", time: "3 hours ago", level: "info" },
];

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPin, setAdminPin] = useState("");
    const [activeTab, setActiveTab] = useState<"Overview" | "Access" | "Studio" | "Security">("Overview");

    const [waitlist, setWaitlist] = useState<any[]>([]);
    const [tutorials, setTutorials] = useState<any[]>([]);

    const [isUploading, setIsUploading] = useState(false);
    const [tutorialForm, setTutorialForm] = useState({ title: "", description: "", videoUrl: "" });

    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));

        if (isAuthenticated) {
            fetch("/api/demo").then(res => res.json()).then(data => setWaitlist(Array.isArray(data) ? data : []));
            fetch("/api/tutorials").then(res => res.json()).then(data => setTutorials(Array.isArray(data) ? data : []));
        }
    }, [isAuthenticated]);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        setIsDark(root.classList.contains("dark"));
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminPin === "1234") setIsAuthenticated(true);
    };

    const handleApprove = async (id: string) => {
        try {
            await fetch("/api/demo", { method: "PUT", body: JSON.stringify({ id, action: "approve" }) });
            setWaitlist(waitlist.map(w => w.id === id ? { ...w, approved: true } : w));
        } catch (error) { console.error("Failed to approve"); }
    };

    const handleUploadTutorial = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const res = await fetch("/api/tutorials", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tutorialForm),
            });
            if (res.ok) {
                const newVid = await res.json();
                setTutorials([newVid, ...tutorials]);
                setTutorialForm({ title: "", description: "", videoUrl: "" });
            }
        } catch (error) { }
        setIsUploading(false);
    };

    // === CONSISTENT LOGIN SCREEN ===
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/10 blur-[150px]" />
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md glass-panel p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-inner">
                            <ShieldAlert className="w-7 h-7 text-black/80 dark:text-white/80" />
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-medium tracking-tight mb-2">Admin Portal</h1>
                        <p className="text-black/50 dark:text-white/50 text-sm font-light">Enter master override PIN to access system.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password" autoFocus maxLength={4} value={adminPin} onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ''))} placeholder="••••"
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-center text-2xl tracking-[1em] placeholder:tracking-normal placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white font-mono"
                        />
                        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all mt-4">
                            Authenticate <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </motion.div>
            </main>
        );
    }

    // === NEW GOD MODE DASHBOARD ===
    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex transition-colors duration-700 font-sans overflow-hidden">

            {/* Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/10 blur-[150px]" />
            </div>

            {/* SIDEBAR - Matches Vault */}
            <aside className="relative z-10 w-64 border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl flex flex-col transition-colors duration-700">
                <div className="p-6 flex items-center gap-3 mb-6 border-b border-black/5 dark:border-white/5 pb-6">
                    <div className="p-2 bg-black dark:bg-white rounded-xl">
                        <ShieldAlert className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <div>
                        <span className="font-semibold tracking-wide text-sm block leading-none">OVERSEER</span>
                        <span className="text-xs text-black/50 dark:text-white/50">Admin Console</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button onClick={() => setActiveTab("Overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Overview" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><Activity className="w-4 h-4" /> System Overview</button>
                    <button onClick={() => setActiveTab("Access")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Access" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><Users className="w-4 h-4" /> Access Ledger</button>
                    <button onClick={() => setActiveTab("Studio")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Studio" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><Video className="w-4 h-4" /> Content Studio</button>
                    <button onClick={() => setActiveTab("Security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Security" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><Terminal className="w-4 h-4" /> Security Matrix</button>
                </nav>

                <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2">
                    {mounted && (
                        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                    )}
                    <Link href="/">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"><LogOut className="w-4 h-4" /> Exit Console</button>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-10 flex-1 overflow-y-auto p-10">
                <AnimatePresence mode="wait">

                    {/* TAB: OVERVIEW */}
                    {activeTab === "Overview" && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-medium">System Overview</h1>
                                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All Systems Operational
                                </div>
                            </div>

                            {/* Top Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="glass-panel p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                    <div className="flex items-center gap-3 text-black/50 dark:text-white/50 mb-2"><Users className="w-4 h-4" /><h3 className="font-medium text-sm">Total Network Users</h3></div>
                                    <p className="text-4xl font-light">{waitlist.filter(w => w.approved).length}</p>
                                </div>
                                <div className="glass-panel p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                    <div className="flex items-center gap-3 text-black/50 dark:text-white/50 mb-2"><Clock className="w-4 h-4" /><h3 className="font-medium text-sm">Pending Approvals</h3></div>
                                    <p className="text-4xl font-light text-amber-500">{waitlist.filter(w => !w.approved).length}</p>
                                </div>
                                <div className="glass-panel p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                    <div className="flex items-center gap-3 text-black/50 dark:text-white/50 mb-2"><Video className="w-4 h-4" /><h3 className="font-medium text-sm">Active Tutorials</h3></div>
                                    <p className="text-4xl font-light text-blue-500">{tutorials.length}</p>
                                </div>
                            </div>

                            {/* Bottom Split Layout to fill space */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="glass-panel p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                    <h3 className="text-lg font-medium mb-6 flex items-center gap-2"><Database className="w-5 h-5 text-blue-500" /> Database Metrics</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2"><span className="text-black/60 dark:text-white/60">Storage Capacity</span><span className="font-medium">12% Used</span></div>
                                            <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-2 overflow-hidden"><div className="bg-blue-500 w-[12%] h-full rounded-full"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2"><span className="text-black/60 dark:text-white/60">API Load Limit</span><span className="font-medium">4% Used</span></div>
                                            <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-2 overflow-hidden"><div className="bg-emerald-500 w-[4%] h-full rounded-full"></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                    <h3 className="text-lg font-medium mb-6 flex items-center gap-2"><Server className="w-5 h-5 text-purple-500" /> System Architecture</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <span className="text-sm font-medium">Authentication</span><span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">NextAuth v4</span>
                                        </li>
                                        <li className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <span className="text-sm font-medium">Database ORM</span><span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">Prisma Client</span>
                                        </li>
                                        <li className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <span className="text-sm font-medium">Encryption Layer</span><span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">Bcrypt Hashing</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: ACCESS CONTROL */}
                    {activeTab === "Access" && (
                        <motion.div key="access" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-medium">User Ledger</h1>
                                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-black/50 dark:text-white/50">
                                    <Search className="w-4 h-4" /> <input type="text" placeholder="Search identity..." className="bg-transparent outline-none text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 w-48" />
                                </div>
                            </div>

                            <div className="glass-panel border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 uppercase tracking-wider text-xs">
                                        <tr><th className="p-5 font-medium">User Identity</th><th className="p-5 font-medium">Status</th><th className="p-5 font-medium text-right">Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {waitlist.length === 0 ? (
                                            <tr><td colSpan={3} className="p-12 text-center text-black/40 dark:text-white/40">No identities in ledger.</td></tr>
                                        ) : (
                                            waitlist.map((user) => (
                                                <tr key={user.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-medium">{user.email.charAt(0).toUpperCase()}</div>
                                                            <span className="font-medium">{user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        {user.approved ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /> Cleared Access</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"><AlertTriangle className="w-3.5 h-3.5" /> Pending Review</span>
                                                        )}
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        {!user.approved && (
                                                            <button onClick={() => handleApprove(user.id)} className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-xs font-medium hover:shadow-lg transition-all">Grant Access</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: CONTENT STUDIO */}
                    {activeTab === "Studio" && (
                        <motion.div key="studio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <h1 className="text-3xl font-medium mb-8">Content Studio</h1>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="glass-panel border border-black/10 dark:border-white/10 rounded-3xl p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                        <h3 className="font-medium mb-6 flex items-center gap-2"><Upload className="w-5 h-5 text-blue-500" /> Deploy Tutorial</h3>
                                        <form onSubmit={handleUploadTutorial} className="space-y-4">
                                            <div>
                                                <label className="text-xs text-black/50 dark:text-white/50 mb-1 block">Module Title</label>
                                                <input type="text" required value={tutorialForm.title} onChange={(e) => setTutorialForm({ ...tutorialForm, title: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all" placeholder="e.g. Setting up NextAuth" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-black/50 dark:text-white/50 mb-1 block">Description</label>
                                                <textarea required value={tutorialForm.description} onChange={(e) => setTutorialForm({ ...tutorialForm, description: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all h-24 resize-none" placeholder="What will they learn?" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-black/50 dark:text-white/50 mb-1 block">Video URL</label>
                                                <input type="url" required value={tutorialForm.videoUrl} onChange={(e) => setTutorialForm({ ...tutorialForm, videoUrl: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all" placeholder="https://youtube.com/..." />
                                            </div>
                                            <button type="submit" disabled={isUploading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/20">
                                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Module to Vault"}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {tutorials.length === 0 ? (
                                            <div className="col-span-full py-20 text-center"><Video className="w-8 h-8 text-black/30 dark:text-white/30 mx-auto mb-4" /><p className="text-black/50 dark:text-white/50">No tutorials deployed yet.</p></div>
                                        ) : (
                                            tutorials.map((vid) => (
                                                <div key={vid.id} className="glass-panel border border-black/10 dark:border-white/10 rounded-3xl p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md group">
                                                    <div className="w-full aspect-video bg-black/5 dark:bg-white/5 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
                                                        <div className="w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg"><Video className="w-5 h-5 text-black dark:text-white" /></div>
                                                    </div>
                                                    <h4 className="font-medium text-lg mb-1">{vid.title}</h4>
                                                    <p className="text-sm text-black/50 dark:text-white/50 line-clamp-2 mb-4">{vid.description}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: SECURITY MATRIX */}
                    {activeTab === "Security" && (
                        <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-medium">Security Matrix</h1>
                                <span className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Audit Log
                                </span>
                            </div>

                            <div className="glass-panel border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-md font-mono text-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 text-xs uppercase tracking-wider">
                                        <tr><th className="p-5 font-medium">Event</th><th className="p-5 font-medium">IP Address</th><th className="p-5 font-medium text-right">Timestamp</th></tr>
                                    </thead>
                                    <tbody>
                                        {AUDIT_LOGS.map((log) => (
                                            <tr key={log.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-2 h-2 rounded-full ${log.level === 'warn' ? 'bg-amber-500' : log.level === 'info' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                                        <span className="font-medium">{log.action}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-black/60 dark:text-white/60">{log.ip}</td>
                                                <td className="p-5 text-right text-black/60 dark:text-white/60">{log.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 glass-panel p-8 border border-red-500/30 bg-red-500/5 rounded-3xl backdrop-blur-md">
                                <h3 className="text-red-500 font-medium mb-2 flex items-center gap-2 text-xl"><ShieldAlert className="w-6 h-6" /> System Kill Switch</h3>
                                <p className="text-red-500/70 text-sm mb-6 max-w-2xl">Initiating this protocol will permanently wipe all vault databases and lock out all users immediately. This action bypasses all standard deletion safeguards and cannot be undone.</p>
                                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center gap-2">
                                    Initiate Complete Wipe <AlertTriangle className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </main>
    );
}