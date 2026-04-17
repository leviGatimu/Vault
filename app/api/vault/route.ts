import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Fetch all saved credentials
export async function GET() {
    try {
        const credentials = await db.credential.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(credentials);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 });
    }
}

// POST: Save a new credential
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, username, password, category } = body;

        const newCredential = await db.credential.create({
            data: {
                name,
                username,
                password,
                category: category || "Other",
            },
        });

        return NextResponse.json(newCredential);
    } catch (error) {
        return NextResponse.json({ error: "Failed to save credential" }, { status: 500 });
    }
}