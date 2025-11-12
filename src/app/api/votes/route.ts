import { VoteType } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, type } = body;

    if (!conversationId || !type) {
      return NextResponse.json(
        { message: "Données manquantes" },
        { status: 400 }
      );
    }

    if (type !== VoteType.UP && type !== VoteType.DOWN) {
      return NextResponse.json(
        { message: "Type de vote invalide" },
        { status: 400 }
      );
    }
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation non trouvée" },
        { status: 404 }
      );
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_conversationId: {
          userId: session.user.id,
          conversationId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        return NextResponse.json({ message: "Vote retiré" });
      } else {
        // Sinon on le met à jour
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
        return NextResponse.json({ message: "Vote mis à jour" });
      }
    }

    await prisma.vote.create({
      data: {
        type,
        userId: session.user.id,
        conversationId,
      },
    });

    return NextResponse.json({ message: "Vote enregistré" });
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
