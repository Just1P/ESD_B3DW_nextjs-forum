import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      messages: {
        select: { id: true },
        where: {
          deletedAt: null,
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

  return NextResponse.json(conversation);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Vérifier que la conversation existe et récupérer son auteur
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

    // Vérifier que l'utilisateur est bien l'auteur de la conversation
    if (conversation.userId !== user.id) {
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
    return NextResponse.json(
      { error: "Authentification requise" },
      { status: 401 }
    );
  }
}
