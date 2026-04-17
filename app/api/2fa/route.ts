import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- Importing our central config!
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function GET() {
    try {
        // Pass authOptions into the session!
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const secret = speakeasy.generateSecret({
            name: `Vault App (${session.user.email})`
        });

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "");

        return NextResponse.json({
            secret: secret.base32,
            qrCodeUrl: qrCodeUrl
        });
    } catch (error) {
        console.error("=== 2FA SETUP CRASH ===", error);
        return NextResponse.json({ error: "Failed to setup 2FA" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Pass authOptions here too!
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { token, secret } = await req.json();

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (!verified) {
            return NextResponse.json({ error: "Invalid 2FA Code. Try again." }, { status: 400 });
        }

        await db.user.update({
            where: { email: session.user.email },
            data: {
                twoFactorSecret: secret,
                twoFactorEnabled: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("=== 2FA VERIFY CRASH ===", error);
        return NextResponse.json({ error: "Failed to verify 2FA" }, { status: 500 });
    }
}