import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// This loads a clean, Apple-esque sans-serif font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vault | Secure Password Manager",
  description: "A beautifully minimal password manager. Categorize, search, and unlock with your master PIN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}