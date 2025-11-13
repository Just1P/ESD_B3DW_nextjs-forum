import { prisma } from "@/lib/prisma";
import { Vote, VoteType } from "@/generated/prisma";

export class VoteRepository {
  async findByUserAndConversation(
    userId: string,
    conversationId: string
  ): Promise<Vote | null> {
    return prisma.vote.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });
  }

  async create(
    userId: string,
    conversationId: string,
    type: VoteType
  ): Promise<Vote> {
    return prisma.vote.create({
      data: {
        userId,
        conversationId,
        type,
      },
    });
  }

  async update(
    userId: string,
    conversationId: string,
    type: VoteType
  ): Promise<Vote> {
    return prisma.vote.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
      data: {
        type,
      },
    });
  }

  async delete(userId: string, conversationId: string): Promise<Vote> {
    return prisma.vote.delete({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });
  }

  async upsert(
    userId: string,
    conversationId: string,
    type: VoteType
  ): Promise<Vote> {
    return prisma.vote.upsert({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
      update: {
        type,
      },
      create: {
        userId,
        conversationId,
        type,
      },
    });
  }

  async getStats(conversationId: string) {
    const votes = await prisma.vote.findMany({
      where: { conversationId },
      select: { type: true },
    });

    const upvotes = votes.filter((v) => v.type === VoteType.UP).length;
    const downvotes = votes.filter((v) => v.type === VoteType.DOWN).length;

    return {
      upvotes,
      downvotes,
      voteScore: upvotes - downvotes,
      totalVotes: votes.length,
    };
  }

  async findByUserId(userId: string): Promise<Vote[]> {
    return prisma.vote.findMany({
      where: { userId },
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const voteRepository = new VoteRepository();
