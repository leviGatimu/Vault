import { useState, useEffect } from "react";
import "./style.css";

export default function Popup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

    // Check if they are already logged in when they open the popup
    useEffect(() => {
        chrome.storage.local.get(["overseerUserId"], (result: { [key: string]: any }) => {
            if (result.overseerUserId) setUserId(result.overseerUserId);
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            // Point this to your live Vercel URL when you deploy!
            // Replace this with your actual Vercel project URL (e.g., https://your-project.vercel.app)
            // Replace 'vault-saas-abc123.vercel.app' with your ACTUAL URL from the dashboard
            const response = await fetch("https://vault-one-peach.vercel.app/api/ext-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error("Login failed");

            const data = await response.json();

            // Save the ID to Chrome storage
            chrome.storage.local.set({ overseerUserId: data.userId }, () => {
                setUserId(data.userId);
                setStatus("idle");
            });

        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const handleLogout = () => {
        chrome.storage.local.remove(["overseerUserId"], () => {
            setUserId(null);
        });
    };

    return (
        <div className="w-80 min-h-[260px] p-6 bg-[#020617] text-white font-sans flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                    <span className="text-emerald-500 font-bold">V</span>
                </div>
                <h1 className="text-xl font-medium tracking-wide">Overseer</h1>
            </div>

            {userId ? (
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">✓</div>
                    <h2 className="text-lg font-medium mb-1">Vault Connected</h2>
                    <p className="text-xs text-white/50 mb-6">Auto-capture is active and securing your logins.</p>
                    <button onClick={handleLogout} className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors rounded-lg text-sm font-medium">Disconnect</button>
                </div>
            ) : (
                <form onSubmit={handleLogin} className="space-y-3">
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    <input type="password" placeholder="Master Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />

                    {status === "error" && <p className="text-xs text-red-400 text-center">Invalid credentials. Try again.</p>}

                    <button type="submit" disabled={status === "loading"} className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 mt-2">
                        {status === "loading" ? "Authenticating..." : "Connect Vault"}
                    </button>
                </form>
            )}
        </div>
    );
}