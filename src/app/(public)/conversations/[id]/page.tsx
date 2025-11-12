import MessageForm from "@/components/app/message/MessageForm";
import MessageList from "@/components/app/message/MessageList";
import Link from "next/link";
import VoteButtons from "@/components/app/conversation/VoteButtons";

interface ConversationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { id } = await params;

  console.log("ID de la conversation:", id);
  const response = await fetch(`http://localhost:3000/api/conversations/${id}`, {
    cache: "no-store",
  });
  const conversation = await response.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Navigation */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <span className="mr-1">←</span> Retour aux conversations
          </Link>
        </div>

        {/* Post principal - style Reddit */}
        <div className="bg-white border border-gray-200 rounded-md mb-4 overflow-hidden">
          <div className="flex">
            {/* Vote section */}
            <VoteButtons
              conversationId={conversation.id}
              initialVoteScore={conversation.voteScore || 0}
              initialUserVote={conversation.userVote || null}
            />

            {/* Contenu du post */}
            <div className="flex-1 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">{conversation?.title}</h1>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>Discussion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de réponse */}
        <div className="mb-4">
          <MessageForm conversationId={id} />
        </div>

        {/* Liste des messages/commentaires */}
        <div>
          <MessageList conversationId={id} />
        </div>
      </div>
    </div>
  );
}
