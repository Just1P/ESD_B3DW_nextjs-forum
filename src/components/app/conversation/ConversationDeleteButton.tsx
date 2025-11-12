'use client';

import DeleteButton from "@/components/app/common/DeleteButton";
import { useSession } from "@/lib/auth-client";
import { canModerateContent } from "@/lib/roles";
import type { AuthenticatedUser } from "@/lib/session";
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
  const sessionUser = session?.user as AuthenticatedUser | undefined;
  const isAuthor = sessionUser?.id === authorId;
  const canModerate = canModerateContent(sessionUser?.role);

  if (!isAuthor && !canModerate) {
    return null;
  }

  return (
    <DeleteButton
      className={className}
      entityName="Conversation"
      id={id}
      onDelete={ConversationService.deleteById}
      queryKey="conversations"
    />
  );
}
