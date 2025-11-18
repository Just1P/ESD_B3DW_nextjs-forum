import AdminUsersTable from "@/components/app/admin/AdminUsersTable";
import { RoleBadge } from "@/components/app/common/RoleBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ArrowUpRight, MessageSquare, Users } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function fetchDashboardData(adminId: string) {
  const [userCount, conversationCount, messageCount, recentUsers, recentConversations] =
    await Promise.all([
      prisma.user.count(),
      prisma.conversation.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.message.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              conversations: true,
              messages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
      prisma.conversation.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          _count: {
            select: {
              messages: true,
              votes: true,
            },
          },
        },
      }),
    ]);

  return {
    metrics: {
      userCount,
      conversationCount,
      messageCount,
    },
    users: recentUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      conversationsCount: user._count.conversations,
      messagesCount: user._count.messages,
    })),
    conversations: recentConversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      author: conversation.author
        ? {
            id: conversation.author.id,
            name: conversation.author.name,
            role: conversation.author.role,
          }
        : null,
      messagesCount: conversation._count.messages,
      votesCount: conversation._count.votes,
    })),
    adminId,
  };
}

export default async function AdminDashboardPage() {
  let adminId: string;

  try {
    const admin = await requireAdmin();
    adminId = admin.id;
  } catch (error) {
    console.error("Erreur lors de la vérification des droits admin:", error);
    redirect("/unauthorized");
  }

  let dashboardData;
  try {
    dashboardData = await fetchDashboardData(adminId);
  } catch (error) {
    console.error("Erreur lors du chargement des données du dashboard:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <h1 className="text-lg font-semibold mb-2">Erreur inattendue</h1>
          <p className="text-sm">
            Impossible de charger les informations du dashboard administrateur pour le moment.
            Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  const { metrics, users, conversations } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard administrateur
          </h1>
          <p className="text-sm text-gray-500">
            Surveillez la communauté, gérez les rôles et gardez le forum en bonne santé.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Utilisateurs inscrits
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.userCount}
              </div>
              <p className="text-xs text-gray-500">
                Comptes totaux enregistrés
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Conversations actives
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.conversationCount}
              </div>
              <p className="text-xs text-gray-500">
                Discussions disponibles sur le forum
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Messages publiés
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.messageCount}
              </div>
              <p className="text-xs text-gray-500">
                Contributions non supprimées
              </p>
            </CardContent>
          </Card>
        </div>

        <AdminUsersTable users={users} currentAdminId={adminId} />

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Conversations récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucune conversation récente à afficher.
              </p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-start justify-between gap-4 border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {conversation.title || "Conversation sans titre"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{formatDistanceToNow(conversation.createdAt)}</span>
                      {conversation.author && (
                        <>
                          <span>•</span>
                          <span>{conversation.author.name || "Utilisateur"}</span>
                          <RoleBadge role={conversation.author.role} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 font-medium text-blue-600">
                      {conversation.messagesCount} message
                      {conversation.messagesCount > 1 ? "s" : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-100 bg-purple-50 px-2 py-1 font-medium text-purple-600">
                      {conversation.votesCount} vote
                      {conversation.votesCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

