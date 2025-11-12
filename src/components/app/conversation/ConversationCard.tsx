import { UserAvatar } from "@/components/app/common/UserAvatar";
import { AuthorInfo } from "@/components/app/common/AuthorInfo";
import ConversationDeleteButton from "@/components/app/conversation/ConversationDeleteButton";
import { ConversationWithExtend } from "@/types/conversation.type";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import VoteButtons from "./VoteButtons";

interface ConversationCardProps {
  conversation: ConversationWithExtend;
}

export default function ConversationCard({
  conversation,
}: ConversationCardProps) {

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-md overflow-hidden">
      <div className="flex">
        <VoteButtons
          conversationId={conversation.id}
          initialVoteScore={conversation.voteScore || 0}
          initialUserVote={conversation.userVote || null}
        />

        <div className="flex-1 p-3">
          <div className="block">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <UserAvatar 
                  user={conversation.author}
                  size="xs"
                  withLink
                />
                <AuthorInfo 
                  author={conversation.author}
                  createdAt={conversation.createdAt}
                  withLink
                  prefix="Posté par"
                />
              </div>
              <ConversationDeleteButton
                id={conversation.id}
                authorId={conversation.author?.id || null}
                className="text-xs"
              />
            </div>

            <Link
              href={`/conversations/${conversation.id}`}
              className="block group"
            >
              <h3 className="font-medium text-base group-hover:text-blue-600 transition-colors mb-2">
                {conversation?.title}
              </h3>
            </Link>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link
                href={`/conversations/${conversation.id}`}
                className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">
                  {conversation?.messages.length}{" "}
                  {conversation?.messages.length <= 1 ? "réponse" : "réponses"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
