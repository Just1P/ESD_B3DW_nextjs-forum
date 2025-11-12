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
};
