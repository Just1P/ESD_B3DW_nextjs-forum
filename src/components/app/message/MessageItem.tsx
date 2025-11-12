"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { formatDistanceToNow } from "@/lib/date";
import MessageService from "@/services/message.service";
import { Pencil } from "lucide-react";
import Link from "next/link";
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
    <div className="bg-white border-l-2 border-transparent hover:border-gray-300 transition-colors">
      <div className="flex gap-3 p-4">
        <div className="flex flex-col items-center gap-2 pt-1">
          {message.author ? (
            <Link href={`/users/${message.author.id}`}>
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={message.author?.image || undefined}
                  key={message.author?.image || "default"}
                />
                <AvatarFallback className="text-xs">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="w-0.5 bg-gray-200 flex-1 min-h-[20px]"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {message.author ? (
              <Link
                href={`/users/${message.author.id}`}
                className="font-medium text-sm text-gray-900 hover:underline"
              >
                {authorName}
              </Link>
            ) : (
              <span className="font-medium text-sm text-gray-900">
                {authorName}
              </span>
            )}
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(message.createdAt)}
            </span>
            {message.updatedAt &&
              message.updatedAt.toString() !== message.createdAt.toString() && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400 italic">modifié</span>
                </>
              )}
          </div>

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

          {isAuthor && !isEditing && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <DeleteButton
                entityName="Message"
                queryKey="messages"
                onDelete={MessageService.deleteById}
                id={message.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
