import { VoteType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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
    return NextResponse.json(
      { error: "Authentification requise" },
      { status: 401 }
    );
  }
}
