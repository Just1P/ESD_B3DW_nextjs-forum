import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "@/lib/date";
import { UserWithContributions } from "@/types/user.type";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/user/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const user: UserWithContributions = await response.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-1">←</span> Retour à l&apos;accueil
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name || "Utilisateur anonyme"}
                </h1>
                {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}
                <div className="flex gap-6 text-sm text-gray-500">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {user._count.conversations}
                    </span>{" "}
                    conversation{user._count.conversations !== 1 ? "s" : ""}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      {user._count.messages}
                    </span>{" "}
                    message{user._count.messages !== 1 ? "s" : ""}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      {user._count.votes}
                    </span>{" "}
                    vote{user._count.votes !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Membre depuis{" "}
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Conversations créées ({user.conversations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.conversations.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Aucune conversation créée pour le moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {user.conversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={`/conversations/${conversation.id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">
                        {conversation.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {conversation._count?.messages || 0} réponse
                          {(conversation._count?.messages || 0) !== 1
                            ? "s"
                            : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          {conversation.voteScore} vote
                          {Math.abs(conversation.voteScore || 0) !== 1
                            ? "s"
                            : ""}
                        </span>
                        <span>
                          {formatDistanceToNow(
                            new Date(conversation.createdAt)
                          )}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Messages récents ({user.messages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {user.messages.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Aucun message posté pour le moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {user.messages.slice(0, 10).map((message) =>
                    message.conversationId ? (
                      <Link
                        key={message.id}
                        href={`/conversations/${message.conversationId}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        <div className="text-xs text-gray-500 mb-2">
                          Dans{" "}
                          <span className="font-medium text-gray-700">
                            {message.Conversation?.title || "Discussion"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                          {message.content}
                        </p>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.createdAt))}
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={message.id}
                        className="block p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                        title="Conversation supprimée"
                      >
                        <div className="text-xs text-gray-500 mb-2">
                          Dans{" "}
                          <span className="font-medium text-gray-700">
                            {message.Conversation?.title ||
                              "Discussion supprimée"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                          {message.content}
                        </p>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.createdAt))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
