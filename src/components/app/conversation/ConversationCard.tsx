import { getRelativeTime } from "@/lib/date";
import { ConversationWithExtend } from "@/types/conversation.type";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import VoteButtons from "./VoteButtons";

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
    <div className="bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-md overflow-hidden">
      <div className="flex">
        {/* Vote section à gauche - style Reddit */}
        <VoteButtons
          conversationId={conversation.id}
          initialVoteScore={conversation.voteScore || 0}
          initialUserVote={conversation.userVote || null}
        />

        {/* Contenu principal */}
        <div className="flex-1 p-3">
          <Link href={`/conversations/${conversation.id}`} className="block group">
            {/* Info auteur et date */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-5 w-5">
              <AvatarImage src={conversation.author?.image || undefined} />
                <AvatarFallback className="text-[10px]">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
              <span className="text-xs text-gray-600">
                Posté par <span className="font-medium hover:underline">{authorName}</span>
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {getRelativeTime(conversation.createdAt)}
              </span>
            </div>

            {/* Titre */}
            <h3 className="font-medium text-base group-hover:text-blue-600 transition-colors mb-2">
              {conversation?.title}
            </h3>

            {/* Footer avec stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">
                  {conversation?.messages.length}{" "}
                  {conversation?.messages.length <= 1 ? "réponse" : "réponses"}
              </span>
            </div>
          </div>
    </Link>
        </div>
      </div>
    </div>
  );
}
