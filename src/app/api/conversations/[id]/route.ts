import { prisma } from "@/lib/prisma";
import { canModerateContent } from "@/lib/roles";
import { requireAuth, getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { VoteType } from "@/generated/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      messages: {
        select: { id: true },
        where: {
          deletedAt: null,
        },
      },
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation non trouvée" },
      { status: 404 }
    );
  }

  const upvotes = conversation.votes.filter(
    (v) => v.type === VoteType.UP
  ).length;
  const downvotes = conversation.votes.filter(
    (v) => v.type === VoteType.DOWN
  ).length;
  const voteScore = upvotes - downvotes;
  const userVote = currentUser
    ? conversation.votes.find((v) => v.userId === currentUser.id)?.type || null
    : null;

  return NextResponse.json({
    ...conversation,
    voteScore,
    userVote,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        userId: true,
        deletedAt: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvée" },
        { status: 404 }
      );
    }

    if (conversation.deletedAt) {
      return NextResponse.json(
        { error: "Cette conversation a déjà été supprimée" },
        { status: 410 }
      );
    }

    const isOwner = conversation.userId === user.id;
    const canModerate = canModerateContent(user.role);

    if (!isOwner && !canModerate) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cette conversation" },
        { status: 403 }
      );
    }

    const deletedConversation = await prisma.conversation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.error("Erreur lors de la suppression de la conversation:", error);
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
