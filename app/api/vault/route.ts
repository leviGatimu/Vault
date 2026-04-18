import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js"; // Import this

// Initialize Supabase (Ensure you have these env vars)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for backend access
);

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await db.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 1. Fetch from Prisma (Your existing manual credentials)
        const credentials = await db.credential.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Fetch from Supabase (The data captured by the Extension)
        const { data: extensionData, error } = await supabase
            .from('vault_logins')
            .select('*')
            .eq('user_id', user.id);

        // 3. Merge them together
        // We add a 'source' property so you can see if it was manual or captured
        const manualItems = credentials.map(c => ({ ...c, source: 'manual' }));
        const capturedItems = (extensionData || []).map(e => ({
            id: e.id,
            name: e.website,
            username: e.username,
            password: e.password,
            category: 'Social', // Default category
            source: 'extension'
        }));

        const combined = [...manualItems, ...capturedItems];

        return NextResponse.json(combined);
    } catch (error) {
        console.error("Fetch Error:", error);
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