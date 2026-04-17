import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        if (!password) return NextResponse.json({ error: "No password provided" }, { status: 400 });

        // 1. Scramble the password into a SHA-1 hash
        const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

        // 2. Split the hash for k-Anonymity
        const prefix = hash.slice(0, 5); // We send this
        const suffix = hash.slice(5);    // We keep this secret

        // 3. Fetch all breached hashes that start with our 5-character prefix
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: { 'User-Agent': 'Vault-Zero-Knowledge-App' } // The API requires a User-Agent
        });

        if (!res.ok) throw new Error("Failed to reach breach database");

        const data = await res.text();

        // 4. Search the returned list for our secret suffix
        const lines = data.split('\n');
        let pwnedCount = 0;

        for (const line of lines) {
            const [lineSuffix, count] = line.split(':');
            if (lineSuffix === suffix) {
                pwnedCount = parseInt(count.trim(), 10);
                break;
            }
        }

        return NextResponse.json({
            leaked: pwnedCount > 0,
            count: pwnedCount
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to check database" }, { status: 500 });
    }
}