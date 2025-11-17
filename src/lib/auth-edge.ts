import type { NextRequest } from "next/server";

export function hasSessionCookie(request: NextRequest): boolean {
  const sessionCookie =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");

  // Debug: Log all cookies
  const allCookies = Array.from(request.cookies.getAll());
  console.log("🍪 All cookies:", allCookies.map((c) => c.name).join(", "));
  console.log("🔍 Session cookie exists:", !!sessionCookie?.value);

  return !!sessionCookie?.value;
}
export function getSessionCookie(request: NextRequest): string | null {
  const sessionCookie =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");
  return sessionCookie?.value || null;
}
