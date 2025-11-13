import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasSessionCookie } from "./lib/auth-edge";

const PUBLIC_ROUTES = [
  "/api/health",
  "/api/auth",
  "/signin",
  "/signup",
  "/forgot-password",
];

const PROTECTED_API_ROUTES: string[] = [];

const ADMIN_ROUTES = ["/api/admin", "/admin"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname) || isAdminRoute(pathname)) {
    // Check if user has a session cookie
    const hasSession = hasSessionCookie(request);

    if (!hasSession) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentification requise" },
          { status: 401 }
        );
      }
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // For admin routes, we'll do a more thorough check in the API route itself
    // Middleware just ensures there's a session cookie
    // Full role verification happens server-side in API routes/server components
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
