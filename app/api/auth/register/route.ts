import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, pin } = await req.json();

        // 1. Check if they are on the approved waitlist
        const waitlistUser = await db.demoRequest.findUnique({ where: { email } });
        if (!waitlistUser || !waitlistUser.approved) {
            return NextResponse.json({ error: "Email not approved for beta access." }, { status: 403 });
        }

        // 2. Check if they already created an account
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Account already exists. Please login." }, { status: 400 });
        }

        // 3. Encrypt the Master PIN
        const hashedPin = await bcrypt.hash(pin, 10);

        // 4. Create the real User Account
        const newUser = await db.user.create({
            data: {
                email: email,
                password: hashedPin
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
}