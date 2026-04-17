import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { pin } = await req.json();
        if (!pin) return NextResponse.json({ error: "PIN required" }, { status: 400 });

        const user = await db.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Compare the entered PIN against their encrypted database hash
        const isMatch = await bcrypt.compare(pin, user.password);
        if (!isMatch) return NextResponse.json({ error: "Invalid PIN" }, { status: 403 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to verify PIN" }, { status: 500 });
    }
}