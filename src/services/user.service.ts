import { prisma } from "@/lib/prisma";
import type { PublicUser, UpdateUserInput } from "@/types/user.type";

export const userService = {
  async getUserById(userId: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
      },
    });

    return user;
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async updateUser(userId: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async deleteUser(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  },

  async getAllUsers(): Promise<PublicUser[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  },

  async getUserWithContributions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        conversations: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            _count: {
              select: {
                messages: true,
                votes: true,
              },
            },
            votes: {
              select: {
                type: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            conversationId: true,
            Conversation: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            conversations: true,
            messages: true,
            votes: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const conversationsWithVoteScore = user.conversations.map((conv) => {
      const { votes, ...rest } = conv;
      const voteScore = votes.reduce((acc, vote) => {
        return acc + (vote.type === "UP" ? 1 : -1);
      }, 0);
      return {
        ...rest,
        voteScore,
      };
    });

    return {
      ...user,
      conversations: conversationsWithVoteScore,
    };
  },
};
