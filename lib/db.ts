import { PrismaClient } from "@prisma/client";

// This prevents Next.js from creating multiple Prisma instances during development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;