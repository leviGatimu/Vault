import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Add this OPTIONS function to handle the browser's "preflight" check
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

        const user = await db.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid Email or PIN" }, {
                status: 401,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        const isValid = await bcrypt.compare(pin, user.password);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid Email or PIN" }, {
                status: 401,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        // Return success with CORS headers
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