import { prisma } from "@/lib/prisma";
import { User, Role } from "@/generated/prisma";

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByIdWithContributions(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        role: true,
        conversations: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            title: true,
            createdAt: true,
            votes: {
              select: {
                type: true,
              },
            },
            _count: {
              select: {
                messages: true,
                votes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        messages: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            conversationId: true,
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
  }

  async update(
    id: string,
    data: {
      name?: string;
      image?: string;
      bio?: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateRole(id: string, role: Role): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!user;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }
}

export const userRepository = new UserRepository();
