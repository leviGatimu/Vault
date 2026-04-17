import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Fetches all waitlist requests from Supabase
export async function GET() {
    try {
        const requests = await db.demoRequest.findMany({
            orderBy: { createdAt: 'desc' } // Newest first
        });
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// PATCH: Updates a user's status to "Approved"
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, approved } = body;

        const updatedRequest = await db.demoRequest.update({
            where: { id: id },
            data: { approved: approved },
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}