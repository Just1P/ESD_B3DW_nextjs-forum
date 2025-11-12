"use client";

import { UserAvatar } from "@/components/app/common/UserAvatar";
import { AuthorInfo } from "@/components/app/common/AuthorInfo";
import { useSession } from "@/lib/auth-client";
import { canModerateContent, isAdmin } from "@/lib/roles";
import type { AuthenticatedUser } from "@/lib/session";
import MessageService, { type MessageWithAuthor } from "@/services/message.service";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import DeleteButton from "../common/DeleteButton";
import MessageEditForm from "./MessageEditForm";

interface MessageItemProps {
  message: MessageWithAuthor;
}

export default function MessageItem({ message }: MessageItemProps) {
  const { data: session } = useSession();
  const sessionUser =
    session?.user && "role" in session.user
      ? (session.user as AuthenticatedUser)
      : undefined;
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = sessionUser?.id === message.author?.id;
  const isAdminUser = isAdmin(sessionUser?.role);
  const canModerate = canModerateContent(sessionUser?.role);
  const canEdit = isAuthor || isAdminUser;
  const canDelete = isAuthor || canModerate;

  return (
    <div className="bg-white border-l-2 border-transparent hover:border-gray-300 transition-colors">
      <div className="flex gap-3 p-4">
        <div className="flex flex-col items-center gap-2 pt-1">
          <UserAvatar 
            user={message.author}
            size="sm"
            withLink
          />
          <div className="w-0.5 bg-gray-200 flex-1 min-h-[20px]"></div>
        </div>

        <div className="flex-1 min-w-0">
          <AuthorInfo 
            author={message.author}
            createdAt={message.createdAt}
            updatedAt={message.updatedAt}
            withLink
            showEdited
            className="mb-2"
            prefix=""
          />

          {isEditing ? (
            <MessageEditForm
              messageId={message.id}
              currentContent={message.content}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-sm text-gray-800 mb-2 leading-relaxed">
              {message.content}
            </p>
          )}

          {!isEditing && (canEdit || canDelete) && (
            <div className="flex items-center gap-2 mt-2">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
              )}
              {canDelete && (
                <DeleteButton
                  entityName="Message"
                  queryKey="messages"
                  onDelete={MessageService.deleteById}
                  id={message.id}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
