/**
 * Génère les initiales d'un utilisateur à partir de son nom
 * @param name - Le nom de l'utilisateur
 * @returns Les initiales en majuscules (max 2 caractères)
 * @example
 * getInitials("Jean Dupont") // "JD"
 * getInitials("Alice") // "AL"
 */
export function getInitials(name?: string | null): string {
  if (!name) return "U";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Type pour les données minimales d'un auteur
 */
export interface AuthorData {
  id: string;
  name: string | null;
  email?: string;
  image: string | null;
}

/**
 * Retourne le nom d'affichage d'un utilisateur
 * @param author - Les données de l'auteur
 * @param fallback - Texte de secours si pas de nom
 */
export function getDisplayName(
  author?: AuthorData | null,
  fallback: string = "Anonyme"
): string {
  return author?.name || fallback;
}
