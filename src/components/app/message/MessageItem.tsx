"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { formatDistanceToNow } from "@/lib/date";
import MessageService from "@/services/message.service";
import { Pencil } from "lucide-react";
import { useState } from "react";
import DeleteButton from "../common/DeleteButton";
import MessageEditForm from "./MessageEditForm";

interface MessageItemProps {
  message: Message & {
    author?: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    } | null;
  };
}

export default function MessageItem({ message }: MessageItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const authorName = message.author?.name || "Anonyme";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAuthor = session?.user?.id === message.author?.id;

  return (
    <div className="border shadow-sm rounded-md p-6 relative">
      {isAuthor && !isEditing && (
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteButton
            entityName="Message"
            queryKey="messages"
            onDelete={MessageService.deleteById}
            id={message.id}
          />
        </div>
      )}
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={message.author?.image || undefined} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{authorName}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(message.createdAt)}
            </span>
            {message.updatedAt &&
              message.updatedAt.toString() !== message.createdAt.toString() && (
                <span className="text-xs text-gray-400 italic">(modifié)</span>
              )}
          </div>
          {isEditing ? (
            <MessageEditForm
              messageId={message.id}
              currentContent={message.content}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-gray-800">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
