import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/user-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserAvatarProps {
  user?: {
    id: string;
    name: string | null;
    image?: string | null;
  } | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  withLink?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const sizeClasses = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

/**
 * Composant réutilisable pour afficher l'avatar d'un utilisateur
 * Peut être cliquable et rediriger vers le profil de l'utilisateur
 */
export function UserAvatar({
  user,
  size = "md",
  withLink = false,
  className,
  onClick,
}: UserAvatarProps) {
  const avatarContent = (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={user?.image || undefined}
        alt={user?.name || "Avatar"}
        key={user?.image || "default"}
      />
      <AvatarFallback className={cn(sizeClasses[size].split(" ")[2])}>
        {getInitials(user?.name)}
      </AvatarFallback>
    </Avatar>
  );

  if (withLink && user?.id) {
    return (
      <Link
        href={`/users/${user.id}`}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
      >
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
}
