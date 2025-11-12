import { headers } from "next/headers";
import type { Role } from "@/generated/prisma";
import { auth, type Session } from "./auth";

export type AuthenticatedSession = Session;
export type AuthenticatedUser = AuthenticatedSession["user"] & { role: Role };

export async function getServerSession(): Promise<AuthenticatedSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session as AuthenticatedSession | null;
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

  return session.user as AuthenticatedUser;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }
  return session.user as AuthenticatedUser;
}
