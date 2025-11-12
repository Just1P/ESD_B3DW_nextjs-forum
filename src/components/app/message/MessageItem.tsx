"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { formatDistanceToNow } from "@/lib/date";
import MessageService from "@/services/message.service";
import DeleteButton from "../common/DeleteButton";

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
      {isAuthor && (
        <DeleteButton
          className="absolute top-2 right-2"
          entityName="Message"
          queryKey="messages"
          onDelete={MessageService.deleteById}
          id={message.id}
        />
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
          </div>
          <p className="text-gray-800">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
