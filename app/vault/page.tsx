"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Plus, Folder, Globe, CreditCard, Lock,
    Copy, Eye, EyeOff, LogOut, Sun, Moon, LayoutGrid, X, Loader2, Command, ShieldAlert, ShieldCheck, Sparkles
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["All Items", "Finance", "Social", "Dev"];

const getIconForCategory = (category: string) => {
    if (category === "Finance") return <CreditCard className="w-5 h-5" />;
    if (category === "Social") return <Globe className="w-5 h-5" />;
    if (category === "Dev") return <Lock className="w-5 h-5" />;
    return <Lock className="w-5 h-5" />;
};

const getColorForCategory = (category: string) => {
    if (category === "Finance") return "text-emerald-500";
    if (category === "Social") return "text-blue-500";
    if (category === "Dev") return "text-purple-500";
    return "text-amber-500";
};

// === VAULT AI: Password Health Engine ===
const analyzePassword = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 8) return { label: "Critical Risk", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldAlert };

    let score = 0;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score < 3 || pwd.length < 10) return { label: "Weak", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: ShieldAlert };
    if (score === 4 && pwd.length >= 14) return { label: "Unbreakable", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: Sparkles };

    return { label: "Secure", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: ShieldCheck };
};

// === VAULT AI: Password Generator ===
const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|{}[]:;?><,./-=";
    let pass = "";
    for (let i = 0; i < 16; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
};

export default function VaultPage() {
    const [credentials, setCredentials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All Items");
    const [searchQuery, setSearchQuery] = useState("");
    const [revealedId, setRevealedId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ name: "", username: "", password: "", category: "Social" });

    const [isCmdKOpen, setIsCmdKOpen] = useState(false);
    const [cmdKQuery, setCmdKQuery] = useState("");
    const cmdKInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));
        fetch("/api/vault")
            .then(res => res.json())
            .then(data => {
                setCredentials(data);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsCmdKOpen((prev) => !prev);
            }
            if (e.key === 'Escape') setIsCmdKOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isCmdKOpen && cmdKInputRef.current) cmdKInputRef.current.focus();
    }, [isCmdKOpen]);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        setIsDark(root.classList.contains("dark"));
    };

    const handleSaveCredential = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/vault", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newCred = await res.json();
                setCredentials([newCred, ...credentials]);
                setIsModalOpen(false);
                setFormData({ name: "", username: "", password: "", category: "Social" });
            }
        } catch (error) {
            console.error("Error saving credential");
        }
        setIsSaving(false);
    };

    const filteredCredentials = credentials.filter(cred => {
        const matchesCategory = activeCategory === "All Items" || cred.category === activeCategory;
        const matchesSearch = cred.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cmdKResults = credentials.filter(cred =>
        cred.name.toLowerCase().includes(cmdKQuery.toLowerCase()) ||
        cred.username.toLowerCase().includes(cmdKQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex transition-colors duration-700 font-sans overflow-hidden">

            {/* Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/10 blur-[150px]" />
            </div>

            {/* SIDEBAR */}
            <aside className="relative z-10 w-64 border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl flex flex-col transition-colors duration-700">
                <div className="p-6 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                        <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-semibold tracking-wide text-lg text-black/90 dark:text-white/90">VAULT</span>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-4 mt-4">Categories</p>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
                                    : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {cat === "All Items" ? <LayoutGrid className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                            {cat}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2">
                    {mounted && (
                        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                    )}
                    <Link href="/">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut className="w-4 h-4" /> Lock & Exit
                        </button>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">

                <header className="px-10 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div
                        onClick={() => setIsCmdKOpen(true)}
                        className="w-full max-w-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors">
                            <Search className="w-4 h-4" />
                            <span className="text-sm">Search your vault...</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono text-black/40 dark:text-white/40">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-full text-sm font-medium shadow-md hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Credential
                    </motion.button>
                </header>

                {/* Credentials Grid */}
                <div className="flex-1 overflow-y-auto p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-medium">{activeCategory}</h1>
                        <span className="text-sm text-black/50 dark:text-white/50">{filteredCredentials.length} Items</span>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-black/40 dark:text-white/40">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p>Decrypting vault...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredCredentials.map((cred) => {
                                    const isRevealed = revealedId === cred.id;
                                    const health = analyzePassword(cred.password); // Vault AI analyzes here!
                                    const HealthIcon = health?.icon || ShieldCheck;

                                    return (
                                        <motion.div
                                            key={cred.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -4 }}
                                            className="glass-panel p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${getColorForCategory(cred.category)}`}>
                                                            {getIconForCategory(cred.category)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-lg">{cred.name}</h3>
                                                            <p className="text-xs text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/10 inline-block px-2 py-1 rounded-md mt-1">{cred.category}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-6">
                                                    <div>
                                                        <p className="text-xs text-black/40 dark:text-white/40 mb-1">Username</p>
                                                        <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/5">
                                                            <span className="text-sm font-medium truncate mr-2">{cred.username}</span>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(cred.username)}
                                                                className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-black/40 dark:text-white/40 mb-1">Password</p>
                                                        <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/5">
                                                            <span className="text-sm font-mono tracking-widest mt-1 truncate mr-2">
                                                                {isRevealed ? cred.password : "••••••••••••"}
                                                            </span>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <button
                                                                    onClick={() => setRevealedId(isRevealed ? null : cred.id)}
                                                                    className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors p-1"
                                                                >
                                                                    {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => navigator.clipboard.writeText(cred.password)}
                                                                    className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors p-1"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* VAULT AI HEALTH BADGE */}
                                            {health && (
                                                <div className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-xl border ${health.bg} ${health.color} ${health.border} text-xs font-medium`}>
                                                    <HealthIcon className="w-3.5 h-3.5" />
                                                    {health.label}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {filteredCredentials.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-black/30 dark:text-white/30" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">The vault is empty</h3>
                                    <p className="text-sm text-black/50 dark:text-white/50 mb-6">Click the button above to secure your first credential.</p>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* === PRO SEARCH MODAL (CMD+K) === */}
            <AnimatePresence>
                {isCmdKOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsCmdKOpen(false)}
                            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }} transition={{ duration: 0.15, ease: "easeOut" }}
                            className="relative w-full max-w-2xl glass-panel rounded-3xl bg-white/90 dark:bg-[#020617]/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
                        >
                            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center gap-4">
                                <Search className="w-6 h-6 text-black/40 dark:text-white/40 ml-2" />
                                <input
                                    ref={cmdKInputRef} type="text" value={cmdKQuery} onChange={(e) => setCmdKQuery(e.target.value)} placeholder="Search credentials..."
                                    className="flex-1 bg-transparent outline-none text-xl placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white"
                                />
                                <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-xs text-black/40 dark:text-white/40 font-mono tracking-widest border border-black/10 dark:border-white/10">ESC</div>
                            </div>
                            <div className="overflow-y-auto p-2">
                                {cmdKResults.length === 0 ? (
                                    <div className="p-8 text-center text-black/40 dark:text-white/40">No credentials found for "{cmdKQuery}"</div>
                                ) : (
                                    cmdKResults.map((cred) => (
                                        <div
                                            key={cred.id} onClick={() => { navigator.clipboard.writeText(cred.password); setIsCmdKOpen(false); }}
                                            className="p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${getColorForCategory(cred.category)}`}>
                                                    {getIconForCategory(cred.category)}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{cred.name}</h4>
                                                    <p className="text-sm text-black/50 dark:text-white/50">{cred.username}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="flex items-center gap-2 text-xs font-medium bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg">
                                                    <Copy className="w-3 h-3" /> Copy Password
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* === ADD CREDENTIAL MODAL WITH AI GENERATOR === */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md glass-panel p-8 rounded-[2.5rem] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 mb-6">
                                <h2 className="text-2xl font-medium">New Credential</h2>
                            </div>

                            <form onSubmit={handleSaveCredential} className="space-y-4">
                                <div>
                                    <label className="text-xs text-black/50 dark:text-white/50 mb-1 block px-1">Service Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Netflix, Chase Bank" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm" />
                                </div>

                                <div>
                                    <label className="text-xs text-black/50 dark:text-white/50 mb-1 block px-1">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm appearance-none">
                                        <option value="Social">Social</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Dev">Dev</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-black/50 dark:text-white/50 mb-1 block px-1">Username / Email</label>
                                    <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Email or handle" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm" />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1 px-1">
                                        <label className="text-xs text-black/50 dark:text-white/50">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, password: generateStrongPassword() })}
                                            className="text-xs text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <Sparkles className="w-3 h-3" /> Vault AI Gen
                                        </button>
                                    </div>
                                    <input type="text" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password or use AI" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm font-mono" />

                                    {/* Live Health Indicator inside Modal */}
                                    {formData.password && (
                                        <div className="mt-2 text-xs flex items-center gap-2 px-1">
                                            <span className="text-black/40 dark:text-white/40">Health:</span>
                                            <span className={`font-medium ${analyzePassword(formData.password)?.color}`}>
                                                {analyzePassword(formData.password)?.label}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    type="submit" disabled={isSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3.5 font-medium mt-4 flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Securely to Vault"}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </main>
    );
}