import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const whereClause = { deletedAt: null };

  const conversationId = searchParams.get("conversationId");

  if (conversationId) {
    Object.assign(whereClause, { conversationId });
  }

  const isDelatedAt = searchParams.get("deletedAt");

  if (isDelatedAt) {
    Object.assign(whereClause, { isDelatedAt });
  }

  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
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

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    const { content, conversationId } = body as {
      content?: unknown;
      conversationId?: unknown;
    };

    if (typeof conversationId !== "string" || conversationId.trim() === "") {
      return NextResponse.json(
        { error: "Une conversation valide est requise" },
        { status: 400 }
      );
    }

    if (typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Le contenu du message ne peut pas être vide" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    if (!conversation || conversation.deletedAt) {
      return NextResponse.json(
        { error: "Conversation introuvable ou supprimée" },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        conversationId,
        userId: user.id,
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

    return NextResponse.json(message);
  } catch (error) {
    console.error("Erreur lors de la création du message:", error);
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
