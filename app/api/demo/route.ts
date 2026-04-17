import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetches all waitlist requests from Supabase
export async function GET() {
    try {
        // Security Check: Block anyone not logged in
        const session = await getServerSession(authOptions);
        console.log("DEBUG: Admin Session Found ->", session);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requests = await db.demoRequest.findMany({
            orderBy: { createdAt: 'desc' } // Newest first
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("=== DEMO GET ERROR ===", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// PATCH: Updates a user's status to "Approved"
export async function PATCH(req: Request) {
    try {
        // Security Check: Block unauthorized approvals
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, approved } = body;

        const updatedRequest = await db.demoRequest.update({
            where: { id: id },
            data: { approved: approved },
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("=== DEMO PATCH ERROR ===", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
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

        // Save to Supabase via Prisma
        const newRequest = await db.demoRequest.create({
            data: {
                email: email,
                approved: false, // Set to false by default
            },
        });

        return NextResponse.json({ success: true, data: newRequest });
    } catch (error: any) {
        console.error("=== WAITLIST POST ERROR ===", error);

        // Check if user is already on the list (P2002 is Prisma's unique constraint error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "You're already on the waitlist!" }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }
}