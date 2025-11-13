import { VoteType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          select: { id: true },
          where: {
            deletedAt: null,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        deletedAt: null,
      },
    });

    const conversationsWithVotes = conversations.map((conversation) => {
      const upvotes = conversation.votes.filter(
        (v) => v.type === VoteType.UP
      ).length;
      const downvotes = conversation.votes.filter(
        (v) => v.type === VoteType.DOWN
      ).length;
      const voteScore = upvotes - downvotes;
      const userVote = currentUser
        ? conversation.votes.find((v) => v.userId === currentUser.id)?.type ||
          null
        : null;

      return {
        ...conversation,
        voteScore,
        userVote,
      };
    });

    return NextResponse.json(conversationsWithVotes);
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des conversations:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
        details:
          "Vérifiez que la base de données est accessible et que les migrations ont été exécutées",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const conversation = await prisma.conversation.create({
      data: {
        title: body.title,
        userId: user.id,
      },
      include: {
        messages: {
          select: { id: true },
          where: {
            deletedAt: null,
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    if (
      error instanceof Error &&
      error.message === "Authentification requise"
    ) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
