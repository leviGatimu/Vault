import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();

        // 1. Create the Gmail "Bot" Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 2. Define the email details
        const mailOptions = {
            from: `"The Vault Security" <${process.env.GMAIL_EMAIL}>`,
            to: to,
            subject: subject,
            html: html,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email Error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}