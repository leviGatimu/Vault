import "./style.css";
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, ShieldCheck, Settings2 } from "lucide-react";

export default function Popup() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        let charset = "";
        if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
        if (options.numbers) charset += "0123456789";
        if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
        if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz";

        let newPassword = "";
        for (let i = 0; i < length; i++) {
            newPassword += charset[Math.floor(Math.random() * charset.length)];
        }
        setPassword(newPassword);
    };

    useEffect(() => { generatePassword(); }, [length, options]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-[350px] p-6 bg-black text-white font-sans border border-white/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h2 className="font-medium tracking-wide text-sm">Vault Generator</h2>
                    <p className="text-xs text-white/50">Military-grade encryption</p>
                </div>
            </div>

            <div className="relative mb-6">
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-24 font-mono text-lg break-all min-h-[4rem] flex items-center">
                    {password}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button onClick={generatePassword} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={copyToClipboard} className={`p-2 rounded-xl transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-black hover:shadow-lg'}`}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-white/70 flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" /> Password Length
                        </label>
                        <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md">{length}</span>
                    </div>
                    <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    {['upper', 'lower', 'numbers', 'symbols'].map((opt) => (
                        <button key={opt} onClick={() => toggleOption(opt as keyof typeof options)} className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${options[opt as keyof typeof options] ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:bg-white/5'}`}>
                            {opt.toUpperCase()}
                            <div className={`w-2 h-2 rounded-full ${options[opt as keyof typeof options] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}