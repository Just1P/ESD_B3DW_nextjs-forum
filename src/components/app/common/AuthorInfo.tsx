import { Role } from "@/generated/prisma";
import { formatDistanceToNow } from "@/lib/date";
import { getDisplayName } from "@/lib/user-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RoleBadge } from "./RoleBadge";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
  role?: Role;
}

interface AuthorInfoProps {
  author?: Author | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  withLink?: boolean;
  prefix?: string;
  className?: string;
  showEdited?: boolean;
  showRoleBadge?: boolean;
}

/**
 * Composant réutilisable pour afficher les informations d'un auteur
 * (nom, date, badge "modifié", etc.)
 */
export function AuthorInfo({
  author,
  createdAt,
  updatedAt,
  withLink = true,
  prefix = "Posté par",
  className,
  showEdited = true,
  showRoleBadge = true,
}: AuthorInfoProps) {
  const displayName = getDisplayName(author);
  const isEdited =
    showEdited &&
    updatedAt &&
    new Date(updatedAt).getTime() !== new Date(createdAt).getTime();
  const role = author?.role;

  return (
    <div
      className={cn("flex items-center gap-2 text-xs text-gray-600", className)}
    >
      {prefix && <span>{prefix}</span>}

      {withLink && author?.id ? (
        <Link
          href={`/users/${author.id}`}
          className="font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {displayName}
        </Link>
      ) : (
        <span className="font-medium">{displayName}</span>
      )}

      <span className="text-gray-400">•</span>

      <span className="text-gray-500">{formatDistanceToNow(createdAt)}</span>

      {showRoleBadge && role && (
        <>
          <span className="text-gray-400">•</span>
          <RoleBadge role={role} />
        </>
      )}

      {isEdited && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 italic">modifié</span>
        </>
      )}
    </div>
  );
}
