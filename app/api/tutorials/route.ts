import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const tutorials = await db.tutorial.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(tutorials);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, videoUrl } = await req.json();
        const newTutorial = await db.tutorial.create({
            data: { title, description, videoUrl }
        });
        return NextResponse.json(newTutorial);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}