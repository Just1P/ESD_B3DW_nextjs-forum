import { prisma } from "@/lib/prisma";
import { Message } from "@/generated/prisma";

export class MessageRepository {
  async findAll(conversationId?: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        deletedAt: null,
        ...(conversationId && { conversationId }),
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

  async findById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({
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
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async create(
    content: string,
    conversationId: string,
    userId: string
  ): Promise<Message> {
    return prisma.message.create({
      data: {
        content,
        conversationId,
        userId,
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
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async update(id: string, content: string): Promise<Message> {
    return prisma.message.update({
      where: { id },
      data: { content },
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
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async softDelete(id: string): Promise<Message> {
    return prisma.message.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async isAuthor(messageId: string, userId: string): Promise<boolean> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { userId: true },
    });

    return message?.userId === userId;
  }

  async exists(id: string): Promise<boolean> {
    const message = await prisma.message.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });

    return !!message && !message.deletedAt;
  }

  async findByUserId(userId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        userId,
        deletedAt: null,
      },
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

  async countByConversation(conversationId: string): Promise<number> {
    return prisma.message.count({
      where: {
        conversationId,
        deletedAt: null,
      },
    });
  }
}

export const messageRepository = new MessageRepository();
