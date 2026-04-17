import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST: Creates the burner link in the database
export async function POST(req: Request) {
    try {
        const { name, username, password } = await req.json();

        const burner = await db.burnerLink.create({
            data: { name, username, password }
        });

        return NextResponse.json({ id: burner.id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate link" }, { status: 500 });
    }
}