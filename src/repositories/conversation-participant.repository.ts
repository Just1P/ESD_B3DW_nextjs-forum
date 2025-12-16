import { prisma } from "@/lib/prisma";
import { ConversationParticipant } from "@/generated/prisma";

export class ConversationParticipantRepository {
  async addParticipant(
    conversationId: string,
    userId: string
  ): Promise<ConversationParticipant> {
    return prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId,
      },
    });
  }

  async addParticipants(
    conversationId: string,
    userIds: string[]
  ): Promise<void> {
    await prisma.conversationParticipant.createMany({
      data: userIds.map((userId) => ({
        conversationId,
        userId,
      })),
    });
  }

  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await prisma.conversationParticipant.delete({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });
  }

  async isParticipant(
    conversationId: string,
    userId: string
  ): Promise<boolean> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });

    return !!participant;
  }

  async getParticipants(conversationId: string) {
    return prisma.conversationParticipant.findMany({
      where: {
        conversationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async getParticipantCount(conversationId: string): Promise<number> {
    return prisma.conversationParticipant.count({
      where: {
        conversationId,
      },
    });
  }
}

export const conversationParticipantRepository =
  new ConversationParticipantRepository();
