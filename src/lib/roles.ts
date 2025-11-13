import { Role } from "@/generated/prisma";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  MODERATOR: "Modérateur",
  USER: "Utilisateur",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  ADMIN:
    "Administrateur du forum. Dispose de tous les droits (gestion des utilisateurs, contenus et paramètres).",
  MODERATOR:
    "Modérateur du forum. Peut modérer les conversations et messages des autres utilisateurs.",
  USER:
    "Utilisateur standard. Peut créer des conversations et des messages, voter et modifier son propre contenu.",
};

export const ROLE_VALUES: Role[] = Object.values(Role) as Role[];

const ROLE_PRIORITY: Record<Role, number> = {
  USER: 1,
  MODERATOR: 2,
  ADMIN: 3,
};

export function isAtLeastRole(
  role: Role | null | undefined,
  minimumRole: Role
): boolean {
  if (!role) {
    return false;
  }
  return ROLE_PRIORITY[role] >= ROLE_PRIORITY[minimumRole];
}

export function isAdmin(role: Role | null | undefined): role is "ADMIN" {
  return role === "ADMIN";
}

export function isModerator(role: Role | null | undefined): role is "ADMIN" | "MODERATOR" {
  return role === "ADMIN" || role === "MODERATOR";
}

export function canModerateContent(role: Role | null | undefined): boolean {
  return isModerator(role);
}

export function roleBadgeClassName(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-700 border border-red-200";
    case "MODERATOR":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
}
