import { Role } from "@/generated/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

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
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
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

      if (isAdminRoute(pathname)) {
        const userRole = (session.user as { role?: Role }).role;

        if (userRole !== Role.ADMIN) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { error: "Accès administrateur requis" },
              { status: 403 }
            );
          }
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Erreur lors de la vérification de la session:", error);

      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Erreur d'authentification" },
          { status: 401 }
        );
      }
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
