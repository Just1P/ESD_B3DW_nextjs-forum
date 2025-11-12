import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerSession() {
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

export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Authentification requise");
  }

  return session.user;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}
