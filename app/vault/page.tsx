"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Plus, Folder, Globe, CreditCard, Lock,
    Copy, Eye, EyeOff, LogOut, Sun, Moon, LayoutGrid, X,
    Loader2, Command, ShieldAlert, ShieldCheck, Sparkles,
    User, Settings, Shield, HardDrive, Download, Trash2, Key,
    ArrowRight, CheckCircle2, Video, ChevronDown, Radar,
    Share2, Smartphone // <-- Make sure Smartphone is right here!
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["All Items", "Finance", "Social", "Dev"];
const DROPDOWN_CATEGORIES = ["Social", "Finance", "Dev"];

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

// === VAULT AI ===
const analyzePassword = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 8) return { label: "Critical Risk", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldAlert, score: 0 };
    let score = 0;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score < 3 || pwd.length < 10) return { label: "Weak", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: ShieldAlert, score: 1 };
    if (score === 4 && pwd.length >= 14) return { label: "Unbreakable", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: Sparkles, score: 3 };
    return { label: "Secure", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: ShieldCheck, score: 2 };
};

const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|{}[]:;?><,./-=";
    let pass = "";
    for (let i = 0; i < 16; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return pass;
};

export default function VaultPage() {

    const [credentials, setCredentials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    //QR
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [twoFactorSecret, setTwoFactorSecret] = useState("");
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [twoFactorStatus, setTwoFactorStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Navigation State
    const [activeView, setActiveView] = useState<"Vault" | "Profile" | "Settings" | "Tutorials">("Vault");
    const [activeCategory, setActiveCategory] = useState("All Items");
    const [searchQuery, setSearchQuery] = useState("");
    const [revealedId, setRevealedId] = useState<string | null>(null);

    // Breach Scanner State
    const [isScanningId, setIsScanningId] = useState<string | null>(null);
    const [scanResults, setScanResults] = useState<Record<string, any>>({});

    // Modals & Custom Dropdown State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ name: "", username: "", password: "", category: "Social" });
    const [isCmdKOpen, setIsCmdKOpen] = useState(false);
    const [cmdKQuery, setCmdKQuery] = useState("");
    const cmdKInputRef = useRef<HTMLInputElement>(null);

    // === JIT SECURITY LOCK STATE ===
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [actionTarget, setActionTarget] = useState<{ id: string, action: "reveal" | "copy", password?: string } | null>(null);
    const [verifyPin, setVerifyPin] = useState("");
    const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "error">("idle");

    // Tutorial State
    const [tutorialStep, setTutorialStep] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));

        const hasSeenTour = localStorage.getItem("vault_tutorial_completed");
        if (!hasSeenTour) setTutorialStep(1);

        fetch("/api/vault").then(res => res.json()).then(data => {
            setCredentials(Array.isArray(data) ? data : []);
            setIsLoading(false);
        });
    }, []);

    const completeTutorial = () => {
        localStorage.setItem("vault_tutorial_completed", "true");
        setTutorialStep(0);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (tutorialStep > 0) return;
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsCmdKOpen((prev) => !prev);
            }
            if (e.key === 'Escape') setIsCmdKOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [tutorialStep]);

    useEffect(() => { if (isCmdKOpen && cmdKInputRef.current) cmdKInputRef.current.focus(); }, [isCmdKOpen]);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        setIsDark(root.classList.contains("dark"));
    };

    const handleSaveCredential = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/vault", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            if (res.ok) {
                const newCred = await res.json();
                setCredentials([newCred, ...credentials]);
                setIsModalOpen(false);
                setFormData({ name: "", username: "", password: "", category: "Social" });
            }
        } catch (error) { console.error("Error saving credential"); }
        setIsSaving(false);
    };
    const handleVerifyPin = async () => {
        setVerifyStatus("loading");
        try {
            const res = await fetch("/api/verify-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin: verifyPin })
            });

            if (res.ok) {
                // PIN is correct! Execute the intercepted action
                if (actionTarget?.action === "reveal") {
                    setRevealedId(actionTarget.id);
                } else if (actionTarget?.action === "copy" && actionTarget.password) {
                    await navigator.clipboard.writeText(actionTarget.password);
                    setToastMessage("Encrypted password copied to clipboard.");
                    setTimeout(() => setToastMessage(null), 3000);
                }

                // Reset the lock
                setIsPinModalOpen(false);
                setVerifyPin("");
                setVerifyStatus("idle");
            } else {
                setVerifyStatus("error");
            }
        } catch (error) {
            setVerifyStatus("error");
        }
    };
    const handleCreateBurnerLink = async (cred: any) => {
        try {
            const res = await fetch("/api/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: cred.name, username: cred.username, password: cred.password })
            });
            const data = await res.json();

            const burnerUrl = `${window.location.origin}/share/${data.id}`;
            await navigator.clipboard.writeText(burnerUrl);

            // KILL THE ALERT, USE THE TOAST
            setToastMessage("Burner link securely copied to clipboard.");
            setTimeout(() => setToastMessage(null), 4000);

        } catch (error) {
            console.error("Failed to create link");
        }
    };
    // === DARK WEB SCANNER LOGIC ===
    const handleScanDarkWeb = async (credId: string, password: string) => {
        setIsScanningId(credId);
        try {
            const res = await fetch("/api/breach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            setScanResults(prev => ({ ...prev, [credId]: data }));
        } catch (error) {
            console.error("Scan failed");
        }
        setIsScanningId(null);
    };

    const filteredCredentials = credentials.filter(cred => {
        const matchesCategory = activeCategory === "All Items" || cred.category === activeCategory;
        const matchesSearch = cred.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cmdKResults = credentials.filter(cred => cred.name.toLowerCase().includes(cmdKQuery.toLowerCase()) || cred.username.toLowerCase().includes(cmdKQuery.toLowerCase()));

    const vaultHealth = () => {
        if (credentials.length === 0) return { label: "No Data", color: "text-black/50 dark:text-white/50", percent: 0 };
        const totalScore = credentials.reduce((acc, cred) => acc + (analyzePassword(cred.password)?.score || 0), 0);
        const maxPossibleScore = credentials.length * 3;
        const healthPercentage = Math.round((totalScore / maxPossibleScore) * 100);
        if (healthPercentage < 40) return { label: "Critical", color: "text-red-500", percent: healthPercentage };
        if (healthPercentage < 80) return { label: "Moderate", color: "text-amber-500", percent: healthPercentage };
        return { label: "Excellent", color: "text-emerald-500", percent: healthPercentage };
    };
    const healthData = vaultHealth();

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-black text-black dark:text-white flex transition-colors duration-700 font-sans overflow-hidden">

            {/* Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/10 blur-[150px]" />
            </div>

            {/* TUTORIAL OVERLAY */}
            <AnimatePresence>
                {tutorialStep > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-all pointer-events-auto">
                        {tutorialStep === 1 && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full glass-panel p-8 rounded-3xl bg-white/90 dark:bg-[#020617]/90 z-[110] text-center border border-white/20">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck className="w-8 h-8 text-emerald-500" /></div>
                                <h2 className="text-2xl font-medium mb-2">Decryption Complete</h2>
                                <p className="text-black/60 dark:text-white/60 text-sm mb-8 leading-relaxed">Welcome to Vault. Your zero-knowledge environment is live. Let's take a quick tour.</p>
                                <button onClick={() => setTutorialStep(2)} className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">Begin Tour <ArrowRight className="w-4 h-4" /></button>
                                <button onClick={completeTutorial} className="mt-4 text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">Skip Tour</button>
                            </motion.div>
                        )}
                        {tutorialStep === 2 && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-28 right-10 max-w-xs w-full glass-panel p-6 rounded-2xl bg-white/90 dark:bg-[#020617]/90 z-[110] border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                <div className="flex items-center gap-2 mb-2 text-emerald-500 font-medium text-sm"><Plus className="w-4 h-4" /> Secure Data</div>
                                <h3 className="text-lg font-medium mb-2">Add Credentials</h3>
                                <p className="text-black/60 dark:text-white/60 text-sm mb-6 leading-relaxed">Start by adding your logins here. You can even use Vault AI to instantly generate passwords.</p>
                                <button onClick={() => setTutorialStep(3)} className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-xl font-medium text-sm">Next Step</button>
                            </motion.div>
                        )}
                        {tutorialStep === 3 && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-28 left-[35%] max-w-xs w-full glass-panel p-6 rounded-2xl bg-white/90 dark:bg-[#020617]/90 z-[110] border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                                <div className="flex items-center gap-2 mb-2 text-blue-500 font-medium text-sm"><Command className="w-4 h-4" /> Pro Search</div>
                                <h3 className="text-lg font-medium mb-2">Lightning Access</h3>
                                <p className="text-black/60 dark:text-white/60 text-sm mb-6 leading-relaxed">Never scroll. Press <kbd className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs">Cmd+K</kbd> anywhere to search and copy a password.</p>
                                <button onClick={() => setTutorialStep(4)} className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-xl font-medium text-sm">Next Step</button>
                            </motion.div>
                        )}
                        {tutorialStep === 4 && (
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute top-64 left-72 max-w-xs w-full glass-panel p-6 rounded-2xl bg-white/90 dark:bg-[#020617]/90 z-[110] border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                                <div className="flex items-center gap-2 mb-2 text-purple-500 font-medium text-sm"><Sparkles className="w-4 h-4" /> Vault AI</div>
                                <h3 className="text-lg font-medium mb-2">Profile & Health</h3>
                                <p className="text-black/60 dark:text-white/60 text-sm mb-6 leading-relaxed">Vault AI actively analyzes your credentials. Check your Profile to monitor your score.</p>
                                <button onClick={completeTutorial} className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"><CheckCircle2 className="w-4 h-4" /> Got it, let's go</button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <aside className={`relative w-64 border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl flex flex-col transition-all duration-700 ${tutorialStep === 4 ? 'z-[105] ring-4 ring-purple-500/50 bg-white dark:bg-[#020617] rounded-r-2xl shadow-2xl' : 'z-10'}`}>
                <div className="p-6 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10"><Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                    <span className="font-semibold tracking-wide text-lg text-black/90 dark:text-white/90">VAULT</span>
                </div>

                <nav className="px-4 space-y-1 mb-6 border-b border-black/5 dark:border-white/5 pb-6">
                    <button onClick={() => setActiveView("Vault")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeView === "Vault" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><LayoutGrid className="w-4 h-4" /> My Vault</button>
                    <button onClick={() => setActiveView("Profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tutorialStep === 4 ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30" : activeView === "Profile" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><User className="w-4 h-4" /> Profile Stats</button>
                    <button onClick={() => setActiveView("Settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeView === "Settings" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><Settings className="w-4 h-4" /> Settings</button>
                    <button onClick={() => setActiveView("Tutorials")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeView === "Tutorials" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}><Video className="w-4 h-4" /> Tutorials</button>
                </nav>

                <AnimatePresence>
                    {activeView === "Vault" && (
                        <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex-1 px-4 space-y-1 overflow-hidden">
                            <p className="px-4 text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-4">Filters</p>
                            {CATEGORIES.map((cat) => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? "bg-black/5 dark:bg-white/10 text-black dark:text-white" : "text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}>
                                    <Folder className="w-4 h-4" /> {cat}
                                </button>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>

                <div className="mt-auto p-4 border-t border-black/5 dark:border-white/5 space-y-2">
                    {mounted && (
                        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                    )}
                    <Link href="/api/auth/signout">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"><LogOut className="w-4 h-4" /> Lock & Exit</button>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="relative flex-1 flex flex-col h-screen overflow-hidden">

                {activeView === "Vault" && (
                    <header className={`px-10 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between transition-all duration-500 ${tutorialStep === 2 || tutorialStep === 3 ? 'relative z-[105]' : ''}`}>
                        <div onClick={() => setIsCmdKOpen(true)} className={`w-full max-w-md border rounded-full px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-500 group ${tutorialStep === 3 ? 'relative z-[105] ring-4 ring-blue-500/50 bg-white dark:bg-[#020617] shadow-2xl scale-105 border-blue-500/50' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                            <div className="flex items-center gap-3 text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors"><Search className="w-4 h-4" /><span className="text-sm">Search your vault...</span></div>
                            <div className="flex items-center gap-1 text-xs font-mono text-black/40 dark:text-white/40"><Command className="w-3 h-3" /><span>K</span></div>
                        </div>
                        <motion.button whileHover={{ scale: tutorialStep > 0 ? 1.05 : 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)} className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-500 flex items-center gap-2 ${tutorialStep === 2 ? 'relative z-[105] ring-4 ring-emerald-500/50 bg-emerald-500 text-white shadow-2xl scale-105' : 'bg-black dark:bg-white text-white dark:text-black shadow-md hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}>
                            <Plus className="w-4 h-4" /> Add Credential
                        </motion.button>
                    </header>
                )}

                <div className="relative z-10 flex-1 overflow-y-auto p-10">
                    <AnimatePresence mode="wait">

                        {/* --- VIEW: VAULT --- */}
                        {activeView === "Vault" && (
                            <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
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
                                                const health = analyzePassword(cred.password);
                                                const HealthIcon = health?.icon || ShieldCheck;
                                                const scanResult = scanResults[cred.id];

                                                return (
                                                    <motion.div key={cred.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -4 }} className="glass-panel p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between mb-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${getColorForCategory(cred.category)}`}>{getIconForCategory(cred.category)}</div>
                                                                    <div><h3 className="font-medium text-lg">{cred.name}</h3><p className="text-xs text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/10 inline-block px-2 py-1 rounded-md mt-1">{cred.category}</p></div>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4 mb-6">
                                                                <div><p className="text-xs text-black/40 dark:text-white/40 mb-1">Username</p><div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/5"><span className="text-sm font-medium truncate mr-2">{cred.username}</span><button onClick={() => navigator.clipboard.writeText(cred.username)} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"><Copy className="w-4 h-4" /></button><button
                                                                    onClick={() => handleCreateBurnerLink(cred)}
                                                                    className="text-black/40 dark:text-white/40 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
                                                                    title="Create Burner Link"
                                                                >
                                                                    <Share2 className="w-4 h-4" />
                                                                </button></div></div>


                                                                <div>
                                                                    <p className="text-xs text-black/40 dark:text-white/40 mb-1">Password</p>
                                                                    <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/5">
                                                                        <span className="text-sm font-mono tracking-widest mt-1 truncate mr-2">{isRevealed ? cred.password : "••••••••••••"}</span>
                                                                        <div className="flex items-center gap-2 shrink-0">

                                                                            {/* REVEAL BUTTON INTERCEPTOR */}
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (isRevealed) {
                                                                                        setRevealedId(null);
                                                                                    } else {
                                                                                        setActionTarget({ id: cred.id, action: "reveal" });
                                                                                        setIsPinModalOpen(true);
                                                                                    }
                                                                                }}
                                                                                className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors p-1"
                                                                            >
                                                                                {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                            </button>

                                                                            {/* COPY BUTTON INTERCEPTOR */}
                                                                            <button
                                                                                onClick={() => {
                                                                                    setActionTarget({ id: cred.id, action: "copy", password: cred.password });
                                                                                    setIsPinModalOpen(true);
                                                                                }}
                                                                                className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors p-1"
                                                                            >
                                                                                <Copy className="w-4 h-4" />
                                                                            </button>

                                                                            <button
                                                                                onClick={() => handleCreateBurnerLink(cred)}
                                                                                className="text-black/40 dark:text-white/40 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
                                                                                title="Create Burner Link"
                                                                            >
                                                                                <Share2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* DARK WEB SCANNER SECTION (Only visible when revealed) */}
                                                                    <AnimatePresence>
                                                                        {isRevealed && (
                                                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                                                                                {!scanResult ? (
                                                                                    <button
                                                                                        onClick={() => handleScanDarkWeb(cred.id, cred.password)}
                                                                                        disabled={isScanningId === cred.id}
                                                                                        className="w-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                                                                    >
                                                                                        {isScanningId === cred.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radar className="w-3.5 h-3.5" />}
                                                                                        {isScanningId === cred.id ? "Scanning Breaches..." : "Scan Dark Web"}
                                                                                    </button>
                                                                                ) : scanResult.leaked ? (
                                                                                    <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-xs text-red-500 flex items-start gap-2">
                                                                                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                                                                        <p><strong>Exposed!</strong> Found {scanResult.count.toLocaleString()} times in known breaches. Change immediately.</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-xs text-emerald-500 flex items-center gap-2 justify-center">
                                                                                        <ShieldCheck className="w-4 h-4" /> Password is clean. No known breaches.
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {health && <div className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-xl border ${health.bg} ${health.color} ${health.border} text-xs font-medium`}><HealthIcon className="w-3.5 h-3.5" /> {health.label}</div>}
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                        {filteredCredentials.length === 0 && (
                                            <div className="col-span-full py-20 text-center"><div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="w-8 h-8 text-black/30 dark:text-white/30" /></div><h3 className="text-lg font-medium mb-1">The vault is empty</h3><p className="text-sm text-black/50 dark:text-white/50 mb-6">Click the button above to secure your first credential.</p></div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* --- VIEW: PROFILE --- */}
                        {activeView === "Profile" && (
                            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto mt-8">
                                <h1 className="text-3xl font-medium mb-8">Profile Overview</h1>
                                <div className="glass-panel rounded-3xl p-8 border border-black/10 dark:border-white/10 mb-8 flex items-center gap-6 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-medium text-white shadow-lg">V</div>
                                    <div><h2 className="text-2xl font-medium mb-1">Vault Administrator</h2><div className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full text-sm text-black/60 dark:text-white/60"><Shield className="w-4 h-4 text-emerald-500" /> Encrypted Session</div></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="glass-panel p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md"><div className="flex items-center gap-3 text-black/50 dark:text-white/50 mb-4"><HardDrive className="w-5 h-5" /><h3 className="font-medium">Storage Metrics</h3></div><p className="text-5xl font-light tracking-tight mb-2">{credentials.length}</p><p className="text-sm text-black/40 dark:text-white/40">Total Credentials Secured</p></div>
                                    <div className="glass-panel p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md"><div className="flex items-center gap-3 text-black/50 dark:text-white/50 mb-4"><ShieldCheck className="w-5 h-5" /><h3 className="font-medium">Overall AI Health Score</h3></div><div className="flex items-end gap-3 mb-2"><p className={`text-5xl font-light tracking-tight ${healthData.color}`}>{healthData.percent}%</p></div><div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-2 mt-4 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${healthData.percent}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${healthData.percent > 80 ? 'bg-emerald-500' : healthData.percent > 40 ? 'bg-amber-500' : 'bg-red-500'}`} /></div></div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- VIEW: SETTINGS --- */}
                        {activeView === "Settings" && (
                            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto mt-8">
                                <h1 className="text-3xl font-medium mb-8">Preferences & Security</h1>

                                <div className="space-y-6">

                                    {/* 1. Master PIN Section */}
                                    <div className="glass-panel rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden">
                                        <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                                            <h3 className="font-medium flex items-center gap-2"><Key className="w-5 h-5 text-emerald-500" /> Authentication</h3>
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium mb-1">Master PIN</h4>
                                                <p className="text-sm text-black/50 dark:text-white/50">Update your decryption key.</p>
                                            </div>
                                            <button className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                                                Change PIN
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2. === NEW 2FA SECTION === */}
                                    <div className="glass-panel rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden">
                                        <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                                            <h3 className="font-medium flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" /> Multi-Factor Authentication</h3>
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium mb-1">Authenticator App</h4>
                                                <p className="text-sm text-black/50 dark:text-white/50">Protect your vault with Google Authenticator or Authy.</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setIs2FAModalOpen(true);
                                                        const res = await fetch("/api/2fa");

                                                        // Safety net: Check if the server actually succeeded
                                                        if (!res.ok) {
                                                            console.error("Server responded with a non-OK status");
                                                            setIs2FAModalOpen(false);
                                                            return;
                                                        }

                                                        const data = await res.json();
                                                        setQrCode(data.qrCodeUrl);
                                                        setTwoFactorSecret(data.secret);
                                                    } catch (error) {
                                                        console.error("Failed to load 2FA wizard", error);
                                                        setIs2FAModalOpen(false);
                                                    }
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                                            >
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>

                                    {/* 3. Data Management Section */}
                                    <div className="glass-panel rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden">
                                        <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                                            <h3 className="font-medium flex items-center gap-2"><Download className="w-5 h-5 text-blue-500" /> Data Management</h3>
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium mb-1">Export Vault</h4>
                                                <p className="text-sm text-black/50 dark:text-white/50">Download encrypted CSV.</p>
                                            </div>
                                            <button className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                                                Export Data
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}

                        {/* --- VIEW: TUTORIALS --- */}
                        {activeView === "Tutorials" && (
                            <motion.div key="tutorials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto mt-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-3xl font-medium">Video Tutorials</h1>
                                    <span className="text-sm px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full font-medium">Updated by Admin</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Empty State / Placeholder for Videos */}
                                    <div className="glass-panel p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md group cursor-pointer">
                                        <div className="w-full aspect-video bg-black/5 dark:bg-white/5 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
                                            <div className="w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                <Video className="w-5 h-5 text-black dark:text-white" />
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-lg mb-1">How to use Vault AI</h3>
                                        <p className="text-sm text-black/50 dark:text-white/50">Learn how to generate unbreakable passwords.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* KEEP EXISTING CMD+K MODAL */}
            <AnimatePresence>
                {isCmdKOpen && (
                    <div className="fixed inset-0 z-[110] flex items-start justify-center pt-[15vh] px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCmdKOpen(false)} className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }} transition={{ duration: 0.15, ease: "easeOut" }} className="relative w-full max-w-2xl glass-panel rounded-3xl bg-white/90 dark:bg-[#020617]/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center gap-4">
                                <Search className="w-6 h-6 text-black/40 dark:text-white/40 ml-2" />
                                <input ref={cmdKInputRef} type="text" value={cmdKQuery} onChange={(e) => setCmdKQuery(e.target.value)} placeholder="Search credentials..." className="flex-1 bg-transparent outline-none text-xl placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white" />
                                <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-xs text-black/40 dark:text-white/40 font-mono tracking-widest border border-black/10 dark:border-white/10">ESC</div>
                            </div>
                            <div className="overflow-y-auto p-2">
                                {cmdKResults.length === 0 ? (
                                    <div className="p-8 text-center text-black/40 dark:text-white/40">No credentials found for "{cmdKQuery}"</div>
                                ) : (
                                    cmdKResults.map((cred) => (
                                        <div key={cred.id} onClick={() => { navigator.clipboard.writeText(cred.password); setIsCmdKOpen(false); }} className="p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${getColorForCategory(cred.category)}`}>
                                                    {getIconForCategory(cred.category)}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{cred.name}</h4><p className="text-sm text-black/50 dark:text-white/50">{cred.username}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="flex items-center gap-2 text-xs font-medium bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg"><Copy className="w-3 h-3" /> Copy Password</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* UPGRADED ADD CREDENTIAL MODAL WITH CUSTOM DROPDOWN */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-panel p-8 rounded-[2.5rem] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-visible">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            <div className="flex items-center gap-2 mb-6"><h2 className="text-2xl font-medium">New Credential</h2></div>

                            <form onSubmit={handleSaveCredential} className="space-y-4">
                                <div><label className="text-xs text-black/50 dark:text-white/50 mb-1 block px-1">Service Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Netflix, Chase Bank" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm" /></div>

                                {/* Custom Glass Dropdown */}
                                <div className="relative z-50">
                                    <label className="text-xs text-black/50 dark:text-white/50 mb-1 block px-1">Category</label>
                                    <div
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm"
                                    >
                                        <span>{formData.category}</span>
                                        <ChevronDown className={`w-4 h-4 text-black/40 dark:text-white/40 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    <AnimatePresence>
                                        {isCategoryDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 w-full mt-2 glass-panel border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden z-50"
                                            >
                                                {DROPDOWN_CATEGORIES.map((cat) => (
                                                    <div
                                                        key={cat}
                                                        onClick={() => { setFormData({ ...formData, category: cat }); setIsCategoryDropdownOpen(false); }}
                                                        className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-sm font-medium transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                                                    >
                                                        {cat}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div><label className="text-xs text-black/50 dark:text-white/50 mb-1 block px-1">Username / Email</label><input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Email or handle" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm" /></div>

                                <div>
                                    <div className="flex items-center justify-between mb-1 px-1">
                                        <label className="text-xs text-black/50 dark:text-white/50">Password</label>
                                        <button type="button" onClick={() => setFormData({ ...formData, password: generateStrongPassword() })} className="text-xs text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"><Sparkles className="w-3 h-3" /> Vault AI Gen</button>
                                    </div>
                                    <input type="text" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password or use AI" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all text-sm font-mono" />
                                    {formData.password && (
                                        <div className="mt-2 text-xs flex items-center gap-2 px-1"><span className="text-black/40 dark:text-white/40">Health:</span><span className={`font-medium ${analyzePassword(formData.password)?.color}`}>{analyzePassword(formData.password)?.label}</span></div>
                                    )}
                                </div>

                                <motion.button type="submit" disabled={isSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3.5 font-medium mt-4 flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Securely to Vault"}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* === SECURE TOAST NOTIFICATION === */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] glass-panel bg-black/80 dark:bg-[#020617]/90 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl"
                    >
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium text-white">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* === 2FA SETUP MODAL === */}
            <AnimatePresence>
                {is2FAModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIs2FAModalOpen(false)} className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-sm glass-panel p-8 rounded-[2.5rem] bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl text-center">
                            <button onClick={() => setIs2FAModalOpen(false)} className="absolute top-6 right-6 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>

                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500"><Smartphone className="w-6 h-6" /></div>
                            <h2 className="text-2xl font-medium mb-2">Setup Authenticator</h2>
                            <p className="text-sm text-black/50 dark:text-white/50 mb-6">Scan this QR code with your authenticator app.</p>

                            {qrCode ? (
                                <div className="bg-white p-4 rounded-xl mx-auto mb-6 inline-block shadow-sm">
                                    <img src={qrCode} alt="2FA QR Code" className="w-40 h-40" />
                                </div>
                            ) : (
                                <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-black/30 dark:text-white/30" /></div>
                            )}

                            <input
                                type="text" maxLength={6} value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))} placeholder="000000"
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            <button
                                onClick={async () => {
                                    setTwoFactorStatus("loading");
                                    const res = await fetch("/api/2fa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: twoFactorCode, secret: twoFactorSecret }) });
                                    if (res.ok) {
                                        setTwoFactorStatus("success");
                                        setToastMessage("2FA successfully enabled!");
                                        setTimeout(() => setIs2FAModalOpen(false), 1500);
                                    } else {
                                        setTwoFactorStatus("error");
                                        alert("Invalid code. Try again.");
                                    }
                                }}
                                disabled={twoFactorCode.length < 6 || twoFactorStatus === "loading"}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {twoFactorStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : twoFactorStatus === "success" ? <CheckCircle2 className="w-5 h-5" /> : "Verify & Enable"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* === JIT SECURITY PIN MODAL === */}
            <AnimatePresence>
                {isPinModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsPinModalOpen(false); setVerifyPin(""); setVerifyStatus("idle"); }} className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-sm glass-panel p-8 rounded-[2.5rem] bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl text-center">
                            <button onClick={() => { setIsPinModalOpen(false); setVerifyPin(""); setVerifyStatus("idle"); }} className="absolute top-6 right-6 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>

                            <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-black/5 dark:border-white/10 shadow-inner">
                                <Lock className="w-8 h-8 text-black/80 dark:text-white/80" />
                            </div>
                            <h2 className="text-2xl font-medium mb-2">Security Lock</h2>
                            <p className="text-sm text-black/50 dark:text-white/50 mb-8 leading-relaxed">Enter your Master PIN to authorize this decryption request.</p>

                            <input
                                type="password" autoFocus maxLength={4} value={verifyPin} onChange={(e) => { setVerifyPin(e.target.value.replace(/\D/g, '')); setVerifyStatus("idle"); }} placeholder="••••"
                                className={`w-full bg-black/5 dark:bg-white/5 border ${verifyStatus === 'error' ? 'border-red-500' : 'border-black/10 dark:border-white/10'} rounded-xl px-4 py-4 text-center text-3xl tracking-[1em] font-mono mb-2 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 outline-none transition-colors text-black dark:text-white`}
                            />

                            {verifyStatus === "error" && <p className="text-red-500 text-xs font-medium mb-4">Invalid Master PIN. Access Denied.</p>}

                            <button
                                onClick={handleVerifyPin}
                                disabled={verifyPin.length < 4 || verifyStatus === "loading"}
                                className="w-full bg-black dark:bg-white text-white dark:text-black font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 hover:shadow-lg"
                            >
                                {verifyStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Request"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}