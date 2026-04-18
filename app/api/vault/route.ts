import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(req: Request) {
    try {
        const { email, pin } = await req.json();

        // 1. Find user in database
        const user = await db.user.findUnique({ where: { email } });

        // 2. Safety check: does user exist and have a password field?
        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid Email or PIN" }, {
                status: 401,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        // 3. Compare the PIN from extension with the 'password' field in DB
        const isValid = await bcrypt.compare(pin, user.password);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid Email or PIN" }, {
                status: 401,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        // 4. Success!
        return NextResponse.json({ userId: user.id }, {
            headers: { "Access-Control-Allow-Origin": "*" }
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, {
            status: 500,
            headers: { "Access-Control-Allow-Origin": "*" }
        });
    }
}