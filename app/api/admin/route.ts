import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

// Initialize the email engine with your secret key
const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Fetches all waitlist requests
export async function GET() {
    try {
        const requests = await db.demoRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// PATCH: Updates status and SENDS EMAIL
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, approved } = body;

        // 1. Update the database first
        const updatedRequest = await db.demoRequest.update({
            where: { id: id },
            data: { approved: approved },
        });

        // 2. If we just approved them, fire off the email!
        if (approved) {
            const { data, error } = await resend.emails.send({
                from: 'Vault Beta <onboarding@resend.dev>', // Resend's required testing address
                to: updatedRequest.email, // The email we just approved
                subject: 'Your Vault is ready.',
                html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 40px 20px; background-color: #000; color: #fff; border-radius: 12px;">
            <h1 style="font-size: 24px; font-weight: 500; margin-bottom: 24px;">Access Granted.</h1>
            <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
              Your request has been approved by the admin. Your zero-knowledge vault is now ready to be initialized.
            </p>
            <a href="http://localhost:3000/login" style="background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
              Enter the Vault
            </a>
            <p style="color: #52525b; font-size: 12px; margin-top: 48px;">
              © 2026 Vault Inc.
            </p>
          </div>
        `,
            });

            if (error) {
                console.error("Resend Error:", error);
                return NextResponse.json({ error: "Approved, but email failed to send." }, { status: 500 });
            }
        }

        // 3. Return success to the frontend dashboard
        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}