import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      deletedAt: null,
    },
  });

  return NextResponse.json(conversations);
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
