import type { PlasmoCSConfig } from "plasmo";
import { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
// Import the supabase client we created
import { supabase } from "./supabase";

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"]
};

export default function VaultContentOverlay() {
    const [capturedData, setCapturedData] = useState<{ username: string, pass: string, site: string, formElement: HTMLFormElement } | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handleFormSubmit = (e: SubmitEvent) => {
            const form = e.target as HTMLFormElement;
            const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;

            if (!passwordInput || !passwordInput.value) return;

            const usernameInput = form.querySelector('input[type="text"], input[type="email"]') as HTMLInputElement;

            // REMOVED e.preventDefault() -> Let the user log in immediately.

            setCapturedData({
                username: usernameInput ? usernameInput.value : "Unknown User",
                pass: passwordInput.value,
                site: window.location.hostname,
                formElement: form
            });

            setShowPrompt(true);
        };

        document.addEventListener("submit", handleFormSubmit, true);
        return () => document.removeEventListener("submit", handleFormSubmit, true);
    }, []);

    const handleSaveToVault = async () => {
        if (!capturedData) return;
        setShowPrompt(false);

        // 1. Ask Chrome for the logged-in User ID
        chrome.storage.local.get(["overseerUserId"], async (result) => {
            const userId = result.overseerUserId;

            // 2. If they aren't logged in, stop the process
            if (!userId) {
                console.warn("Overseer: Cannot save password. Extension is not logged in.");
                return;
            }

            try {
                // 3. Save to Supabase with the attached user_id!
                const { error } = await supabase
                    .from('vault_logins')
                    .insert([
                        {
                            website: capturedData.site,
                            username: capturedData.username,
                            password: capturedData.pass,
                            user_id: userId // <--- BOOM. SECURED.
                        }
                    ]);

                if (error) console.error("Database Error:", error.message);
                else console.log("✅ SUCCESS: Secured to User Vault.");
            } catch (err) {
                console.error("Vault Network Error:", err);
            }
        });
    };

    const handleSkip = () => {
        setShowPrompt(false);
        capturedData?.formElement.submit();
    };

    if (!showPrompt || !capturedData) return null;

    return (
        <div style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 2147483647,
            backgroundColor: "#000",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
            width: "340px",
            color: "#fff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(16, 185, 129, 0.2)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck color="#10b981" size={20} />
                    <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "0.5px" }}>Overseer Vault</span>
                </div>
                <button onClick={handleSkip} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>
                    <X size={18} />
                </button>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: "0 0 8px 0", lineHeight: "1.5" }}>
                Save login for <strong style={{ color: "#fff" }}>{capturedData.site}</strong>?
            </p>

            <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", fontFamily: "monospace", color: "#10b981" }}>
                User: {capturedData.username}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSkip} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>
                    Never
                </button>
                <button onClick={handleSaveToVault} style={{ flex: 2, padding: "10px", background: "#fff", border: "none", borderRadius: "8px", color: "#000", cursor: "pointer", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 14px rgba(255,255,255,0.2)" }}>
                    Save Securely
                </button>
            </div>
        </div>
    );
}