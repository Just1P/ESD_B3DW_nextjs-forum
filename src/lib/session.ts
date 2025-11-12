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

  if (!session?.user) {
    throw new Error("Authentification requise");
  }

  if (!("role" in session.user) || !session.user.role) {
    throw new Error(
      "Session invalide : le rôle de l'utilisateur est manquant. Veuillez vous reconnecter."
    );
  }

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

  if (user.role !== Role.ADMIN) {
    throw new Error("Accès administrateur requis");
  }

  return user;
}
