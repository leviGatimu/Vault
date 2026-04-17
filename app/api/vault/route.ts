import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET: Fetch ONLY the logged-in user's credentials
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const credentials = await db.credential.findMany({
            where: { userId: user.id }, // Security: Only fetch their data
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(credentials);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 });
    }
}

// POST: Save a new credential locked to the user
export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const body = await req.json();
        const { name, username, password, category } = body;

        const newCredential = await db.credential.create({
            data: {
                name,
                username,
                password,
                category: category || "Social",
                userId: user.id, // Security: Lock data to this specific user!
            },
        });

        return NextResponse.json(newCredential);
    } catch (error) {
        return NextResponse.json({ error: "Failed to save credential" }, { status: 500 });
    }
}