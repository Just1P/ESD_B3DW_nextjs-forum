import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getRelativeTime } from "@/lib/date";
import { ConversationWithExtend } from "@/types/conversation.type";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationCardProps {
  conversation: ConversationWithExtend;
}

export default function ConversationCard({
  conversation,
}: ConversationCardProps) {
  const authorName = conversation.author?.name || "Anonyme";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={conversation.author?.image || undefined} />
              <AvatarFallback className="text-xs">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{authorName}</span>
              <span className="text-xs text-gray-500">
                {getRelativeTime(conversation.createdAt)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <h3 className="font-semibold text-lg">{conversation?.title}</h3>
        </CardContent>
        <CardFooter className="w-full flex justify-end">
          <p className="text-sm italic text-zinc-500">
            {conversation?.messages.length > 0
              ? `${conversation?.messages.length} réponse${conversation?.messages.length > 1 ? "s" : ""}`
              : "Aucune réponse"}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
