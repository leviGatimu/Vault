import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                pin: { label: "PIN", type: "password" },
                totp: { label: "2FA Code", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.pin) return null;

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                });
                if (!user) return null;

                const isMatch = await bcrypt.compare(credentials.pin, user.password);
                if (!isMatch) return null;

                if (user.twoFactorEnabled) {
                    if (!credentials.totp) throw new Error("2FA_REQUIRED");

                    const verified = speakeasy.totp.verify({
                        secret: user.twoFactorSecret!,
                        encoding: 'base32',
                        token: credentials.totp,
                        window: 1
                    });

                    if (!verified) throw new Error("INVALID_2FA");
                }

                return { id: String(user.id), email: user.email };
            }
        })
    ]
};