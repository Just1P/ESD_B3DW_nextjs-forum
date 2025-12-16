import { requireAuth } from "@/lib/session";
import Link from "next/link";
import { notFound } from "next/navigation";
import MessageForm from "@/components/app/message/MessageForm";
import MessageList from "@/components/app/message/MessageList";
import Image from "next/image";
import { privateConversationService } from "@/services/server";
import { ForbiddenError } from "@/lib/errors";
import { ConversationWithExtend } from "@/types/conversation.type";

export const dynamic = "force-dynamic";

interface MessageDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MessageDetailPage({
  params,
}: MessageDetailPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  let conversation: ConversationWithExtend;

  try {
    conversation = await privateConversationService.getPrivateConversationById(
      id,
      user.id
    );
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white border border-red-200 rounded-md p-8 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Accès refusé
            </h1>
            <p className="text-gray-700 mb-6">
              Vous n&apos;avez pas accès à cette conversation privée.
            </p>
            <Link
              href="/messages"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <span className="mr-1">←</span> Retour à mes messages
            </Link>
          </div>
        </div>
      );
    }
    notFound();
  }

  const otherParticipant = conversation.participants?.find(
    (p) => p.userId !== user.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="mb-4">
          <Link
            href="/messages"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-1">←</span> Retour aux messages
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-md mb-4 p-6">
          <div className="flex items-center gap-3">
            {otherParticipant?.user?.image ? (
              <Image
                src={otherParticipant.user.image}
                alt={otherParticipant.user.name || "User"}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                {otherParticipant?.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {otherParticipant?.user?.name || "Utilisateur inconnu"}
              </h1>
              <p className="text-sm text-gray-500">
                {otherParticipant?.user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <MessageForm conversationId={id} />
        </div>

        <div>
          <MessageList conversationId={id} />
        </div>
      </div>
    </div>
  );
}
