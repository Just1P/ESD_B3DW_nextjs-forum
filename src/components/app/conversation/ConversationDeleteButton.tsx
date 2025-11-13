"use client";

import DeleteButton from "@/components/app/common/DeleteButton";
import { useSession } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/constants";
import { canModerateContent } from "@/lib/roles";
import type { AuthenticatedUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import ConversationService from "@/services/conversation.service";

interface ConversationDeleteButtonProps {
  className?: string;
  id: string;
  authorId?: string | null;
}

export default function ConversationDeleteButton({
  id,
  className,
  authorId,
}: ConversationDeleteButtonProps) {
  const { data: session } = useSession();
  const sessionUser =
    session?.user && "role" in session.user
      ? (session.user as AuthenticatedUser)
      : undefined;
  const isAuthor = sessionUser?.id === authorId;
  const canModerate = canModerateContent(sessionUser?.role);

  if (!isAuthor && !canModerate) {
    return (
      <span
        className={cn("inline-flex", className)}
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <DeleteButton
      className={className}
      entityName="Conversation"
      id={id}
      onDelete={ConversationService.deleteById}
      queryKey={QUERY_KEYS.CONVERSATIONS}
    />
  );
}
