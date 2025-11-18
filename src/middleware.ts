import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasSessionCookie } from "./lib/auth-edge";

// Routes publiques accessibles sans authentification
const PUBLIC_ROUTES = [
  "/api/health",
  "/api/auth",
  "/signin",
  "/signup",
  "/forgot-password",
];

// Routes protégées nécessitant une authentification
const PROTECTED_API_ROUTES: string[] = [];

// Routes admin nécessitant le rôle ADMIN
// Note: Le middleware vérifie uniquement la présence d'une session.
// La vérification du rôle ADMIN se fait côté serveur avec requireAdmin()
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

  // Ignorer les fichiers statiques et Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Autoriser les routes publiques
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Vérifier les routes admin
  // IMPORTANT: Le middleware vérifie SEULEMENT la présence d'une session
  // La vérification du rôle ADMIN doit être faite côté serveur avec requireAdmin()
  // car le middleware Edge n'a pas accès à la base de données
  if (isAdminRoute(pathname)) {
    const hasSession = hasSessionCookie(request);

    if (!hasSession) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentification requise" },
          { status: 401 }
        );
      }
      // Rediriger vers la page de connexion avec callback
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Session trouvée, laisser passer
    // La vérification du rôle ADMIN se fera côté serveur
    return NextResponse.next();
  }

  // Vérifier les autres routes protégées
  if (isProtectedRoute(pathname)) {
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

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
