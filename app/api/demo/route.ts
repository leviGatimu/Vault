import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetches all waitlist requests from Supabase
export async function GET() {
    try {
        // Security Check: Block anyone not logged in
        const session = await getServerSession(authOptions);
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