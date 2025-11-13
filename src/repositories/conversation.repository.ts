import { prisma } from "@/lib/prisma";
import { Conversation, VoteType } from "@/generated/prisma";
import { ConversationWithExtend } from "@/types/conversation.type";

export class ConversationRepository {
  async findAll(userId?: string): Promise<ConversationWithExtend[]> {
    const conversations = await prisma.conversation.findMany({
      where: {
        deletedAt: null,
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
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        messages: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return conversations.map((conversation) => ({
      ...conversation,
      voteScore: this.calculateVoteScore(conversation.votes),
      userVote: userId
        ? this.getUserVote(conversation.votes, userId)
        : null,
    }));
  }

  async findById(
    id: string,
    userId?: string
  ): Promise<ConversationWithExtend | null> {
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
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        messages: {
          where: {
            deletedAt: null,
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) return null;

    return {
      ...conversation,
      voteScore: this.calculateVoteScore(conversation.votes),
      userVote: userId ? this.getUserVote(conversation.votes, userId) : null,
    };
  }

  async create(title: string, userId: string): Promise<Conversation> {
    return prisma.conversation.create({
      data: {
        title,
        userId,
      },
    });
  }

  async update(id: string, title: string): Promise<Conversation> {
    return prisma.conversation.update({
      where: { id },
      data: { title },
    });
  }

  async softDelete(id: string): Promise<Conversation> {
    return prisma.conversation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async isAuthor(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });

    return conversation?.userId === userId;
  }

  async exists(id: string): Promise<boolean> {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });

    return !!conversation && !conversation.deletedAt;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return prisma.conversation.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  private calculateVoteScore(votes: { type: VoteType }[]): number {
    const upvotes = votes.filter((v) => v.type === VoteType.UP).length;
    const downvotes = votes.filter((v) => v.type === VoteType.DOWN).length;
    return upvotes - downvotes;
  }

  private getUserVote(
    votes: { type: VoteType; userId: string }[],
    userId: string
  ): VoteType | null {
    const userVote = votes.find((v) => v.userId === userId);
    return userVote?.type || null;
  }
}

export const conversationRepository = new ConversationRepository();
