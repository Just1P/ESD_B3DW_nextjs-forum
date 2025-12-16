import { requireAuth } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { privateConversationService } from "@/services/server";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await requireAuth();

  const conversations = await privateConversationService.getPrivateConversations(
    user.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mes Messages</h1>
          <p className="text-gray-600 mt-2">
            Vos conversations privées avec d&apos;autres utilisateurs
          </p>
        </div>

        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-1">←</span> Retour au forum
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <p className="text-gray-600">
              Vous n&apos;avez pas encore de conversations privées.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Visitez le profil d&apos;un utilisateur pour démarrer une
              conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participants?.find(
                (p) => p.userId !== user.id
              );
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block bg-white border border-gray-200 rounded-md p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
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
                        {otherParticipant?.user?.name?.[0]?.toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {otherParticipant?.user?.name || "Utilisateur inconnu"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {lastMessage
                            ? new Date(lastMessage.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )
                            : ""}
                        </span>
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.userId === user.id ? "Vous: " : ""}
                          {lastMessage.content}
                        </p>
                      )}
                      {!lastMessage && (
                        <p className="text-sm text-gray-400 italic">
                          Aucun message
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
