import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Reads the link, then deletes it immediately
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const burner = await db.burnerLink.findUnique({
            where: { id }
        });

        if (!burner) {
            return NextResponse.json({ error: "This link has expired or already self-destructed." }, { status: 404 });
        }

        // Burn it!
        await db.burnerLink.delete({
            where: { id }
        });

        return NextResponse.json(burner);
    } catch (error) {
        return NextResponse.json({ error: "Failed to process burner link" }, { status: 500 });
    }
}