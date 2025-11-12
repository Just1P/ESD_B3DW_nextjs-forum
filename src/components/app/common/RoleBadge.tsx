import type { Role } from "@/generated/prisma";
import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  roleBadgeClassName,
} from "@/lib/roles";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: Role;
  className?: string;
  withDescription?: boolean;
}

export function RoleBadge({
  role,
  className,
  withDescription = false,
}: RoleBadgeProps) {
  if (role === "USER") {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        roleBadgeClassName(role),
        className
      )}
      title={withDescription ? ROLE_DESCRIPTIONS[role] : undefined}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
