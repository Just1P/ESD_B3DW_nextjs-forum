export function getInitials(name?: string | null): string {
  if (!name) return "U";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface AuthorData {
  id: string;
  name: string | null;
  email?: string;
  image: string | null;
}

export function getDisplayName(
  author?: AuthorData | null,
  fallback: string = "Anonyme"
): string {
  return author?.name || fallback;
}
