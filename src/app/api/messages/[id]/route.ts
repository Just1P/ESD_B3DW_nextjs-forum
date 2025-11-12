import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Vérifier que le message existe et récupérer son auteur
    const message = await prisma.message.findUnique({
      where: { id },
      select: {
        userId: true,
        deletedAt: true,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    if (message.deletedAt) {
      return NextResponse.json(
        { error: "Ce message a déjà été supprimé" },
        { status: 410 }
      );
    }

    // Vérifier que l'utilisateur est bien l'auteur du message
    if (message.userId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer ce message" },
        { status: 403 }
      );
    }

    const deletedMessage = await prisma.message.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(deletedMessage);
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
    return NextResponse.json(
      { error: "Authentification requise" },
      { status: 401 }
    );
  }
}
