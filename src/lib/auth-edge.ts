import type { NextRequest } from "next/server";

export function hasSessionCookie(request: NextRequest): boolean {
  const sessionCookie =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");

  return !!sessionCookie?.value;
}
export function getSessionCookie(request: NextRequest): string | null {
  const sessionCookie =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");
  return sessionCookie?.value || null;
}
