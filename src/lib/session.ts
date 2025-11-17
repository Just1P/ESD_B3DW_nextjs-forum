import { Role } from "@/generated/prisma";
import { headers } from "next/headers";
import { auth, type Session } from "./auth";

export type AuthenticatedUser = NonNullable<Session["user"]> & { role: Role };

export async function getServerSession(): Promise<Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await getServerSession();

  console.log("🔍 requireAuth - Session:", session ? "exists" : "null");
  console.log("🔍 requireAuth - User:", session?.user ? JSON.stringify(session.user, null, 2) : "null");

  if (!session?.user) {
    throw new Error("Authentification requise");
  }

  if (!("role" in session.user) || !session.user.role) {
    console.log("❌ requireAuth - Role missing from session!");
    throw new Error(
      "Session invalide : le rôle de l'utilisateur est manquant. Veuillez vous reconnecter."
    );
  }

  console.log("✅ requireAuth - User authenticated with role:", session.user.role);
  return session.user as AuthenticatedUser;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession();
  if (!session?.user || !("role" in session.user) || !session.user.role) {
    return null;
  }
  return session.user as AuthenticatedUser;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  console.log(`🔐 requireAdmin - User role: ${user.role}, Required: ADMIN`);

  if (user.role !== Role.ADMIN) {
    console.log(`❌ requireAdmin - Access denied! User role is ${user.role}, not ADMIN`);
    throw new Error("Accès administrateur requis");
  }

  console.log("✅ requireAdmin - Admin access granted!");
  return user;
}
