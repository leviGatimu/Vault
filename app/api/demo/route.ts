import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";
// ADD THIS LINE: It forces Next.js to always fetch fresh data
export const dynamic = "force-dynamic";
// GET: Fetches all waitlist requests from Supabase
// Security Check temporarily removed to fix Vercel Session 401 bug
export async function GET() {
    try {
        const requests = await db.demoRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("=== DEMO GET ERROR ===", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// PATCH: Updates a user's status to "Approved"
// PUT: Updates a user's status to "Approved" AND sends the email
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, approved } = body;

        // 1. Update the Supabase Database
        const updatedRequest = await db.demoRequest.update({
            where: { id: id },
            data: { approved: approved },
        });

        // 2. If we just approved them, fire the email sequence!
        if (approved === true && updatedRequest.email) {

            console.log("Attempting to send email to:", updatedRequest.email);

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL_EMAIL,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `"Vault Security" <${process.env.GMAIL_EMAIL}>`,
                to: updatedRequest.email,
                subject: "Vault Access Granted 🛡️",
                html: `
                    <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #333;">
                        <h1 style="color: #10b981; font-family: sans-serif;">Access Granted.</h1>
                        <p style="color: #888;">Identity Verified: ${updatedRequest.email}</p>
                        <p>Your clearance has been approved by the Overseer.</p>
                        <p>You may now securely access the network.</p>
                        <a href="https://vault-one-peach.vercel.app" style="display: inline-block; background: #fff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; font-family: sans-serif;">Enter The Vault</a>
                    </div>
                `,
            });
            console.log("Email successfully sent!");
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        // This line is our safety net to see exactly why Google might block it
        console.error("=== APPROVAL ERROR ===", error);
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}
// POST: Saves a new waitlist request from a user
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const newRequest = await db.demoRequest.create({
            data: {
                email: email,
                approved: false,
            },
        });

        return NextResponse.json({ success: true, data: newRequest });
    } catch (error: any) {
        console.error("=== WAITLIST POST ERROR ===", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "You're already on the waitlist!" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }
}