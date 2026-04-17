import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Importing the connection we just made

export async function POST(req: Request) {
    try {
        // 1. Grab the email from the incoming request
        const body = await req.json();
        const { email } = body;

        // 2. Make sure they actually sent an email
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 3. Save it to our Supabase database using Prisma
        const newRequest = await db.demoRequest.create({
            data: {
                email: email,
            },
        });

        // 4. Send a success message back to the frontend
        return NextResponse.json({
            success: true,
            message: "Added to the waitlist!",
            data: newRequest
        }, { status: 201 });

    } catch (error: any) {
        // If the email is already in the database, Prisma will throw a specific error code (P2002)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "This email is already on the waitlist." }, { status: 400 });
        }

        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}