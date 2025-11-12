import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      database_url: !!process.env.DATABASE_URL,
      better_auth_secret: !!process.env.BETTER_AUTH_SECRET,
      next_public_app_url: !!process.env.NEXT_PUBLIC_APP_URL,
      blob_token: !!process.env.BLOB_READ_WRITE_TOKEN,
      resend_api_key: !!process.env.RESEND_API_KEY,
    },
    database: {
      connected: false,
      error: null as string | null,
      tables: [] as string[],
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database.connected = true;

    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    checks.database.tables = tables.map((t) => t.tablename);
  } catch (error) {
    checks.database.error =
      error instanceof Error ? error.message : "Erreur inconnue";
  }

  const hasIssues =
    !checks.checks.database_url ||
    !checks.checks.better_auth_secret ||
    !checks.checks.next_public_app_url ||
    !checks.database.connected;

  return NextResponse.json(checks, {
    status: hasIssues ? 500 : 200,
  });
}
