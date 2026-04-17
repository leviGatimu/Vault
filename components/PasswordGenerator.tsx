"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, ShieldCheck, Settings2 } from "lucide-react";

export default function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        upper: true,
        lower: true,
        numbers: true,
        symbols: true,
    });
    const [copied, setCopied] = useState(false);

    // The core logic
    const generatePassword = () => {
        let charset = "";
        if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
        if (options.numbers) charset += "0123456789";
        if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        // Fallback if they uncheck everything
        if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz";

        let newPassword = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            newPassword += charset[randomIndex];
        }
        setPassword(newPassword);
    };

    // Auto-generate on first load or when options change
    useEffect(() => {
        generatePassword();
    }, [length, options]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-full max-w-sm p-6 rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-2xl text-black dark:text-white font-sans">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h2 className="font-medium tracking-wide text-sm">Vault Generator</h2>
                    <p className="text-xs text-black/50 dark:text-white/50">Military-grade encryption keys</p>
                </div>
            </div>

            {/* Password Display */}
            <div className="relative mb-6">
                <div className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 pr-24 font-mono text-lg break-all min-h-[4rem] flex items-center">
                    {password}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                        onClick={generatePassword}
                        className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className={`p-2 rounded-xl transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-black dark:bg-white text-white dark:text-black hover:shadow-lg'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-5">
                {/* Length Slider */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-black/70 dark:text-white/70 flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" /> Password Length
                        </label>
                        <span className="text-xs font-mono bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md">{length}</span>
                    </div>
                    <input
                        type="range"
                        min="8" max="32"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                        { id: 'upper', label: 'A-Z' },
                        { id: 'lower', label: 'a-z' },
                        { id: 'numbers', label: '0-9' },
                        { id: 'symbols', label: '!@#' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => toggleOption(opt.id as keyof typeof options)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${options[opt.id as keyof typeof options]
                                    ? 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/20 text-black dark:text-white'
                                    : 'bg-transparent border-black/5 dark:border-white/5 text-black/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            {opt.label}
                            <div className={`w-2 h-2 rounded-full ${options[opt.id as keyof typeof options] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-black/10 dark:bg-white/10'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}