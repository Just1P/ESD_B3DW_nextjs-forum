import { prisma } from "@/lib/prisma";
import { canModerateContent, isAdmin } from "@/lib/roles";
import { requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

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
        { error: "Ce message a été supprimé" },
        { status: 410 }
      );
    }

    const isOwner = message.userId === user.id;
    const isAdminUser = isAdmin(user.role);

    if (!isOwner && !isAdminUser) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier ce message" },
        { status: 403 }
      );
    }

    if (!body.content || body.content.trim() === "") {
      return NextResponse.json(
        { error: "Le contenu du message ne peut pas être vide" },
        { status: 400 }
      );
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        content: body.content.trim(),
        updatedAt: new Date(),
      },
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
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Erreur lors de la modification du message:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

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

    const isOwner = message.userId === user.id;
    const canModerate = canModerateContent(user.role);

    if (!isOwner && !canModerate) {
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
