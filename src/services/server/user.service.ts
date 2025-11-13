import { userRepository } from "@/repositories";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { API_ERROR_MESSAGES } from "@/lib/constants";
import { User, Role } from "@/generated/prisma";

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(API_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError(API_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserWithContributions(id: string) {
    const user = await userRepository.findByIdWithContributions(id);

    if (!user) {
      throw new NotFoundError(API_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const conversationsWithScores = user.conversations.map((conversation) => {
      const upvotes = conversation.votes.filter((v) => v.type === "UP").length;
      const downvotes = conversation.votes.filter(
        (v) => v.type === "DOWN"
      ).length;
      return {
        ...conversation,
        voteScore: upvotes - downvotes,
      };
    });

    return {
      ...user,
      conversations: conversationsWithScores,
    };
  }

  async updateProfile(
    userId: string,
    requesterId: string,
    data: {
      name?: string;
      image?: string;
      bio?: string;
    }
  ): Promise<User> {
    const exists = await userRepository.exists(userId);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (userId !== requesterId) {
      throw new ForbiddenError(API_ERROR_MESSAGES.CANNOT_MODIFY_OTHERS);
    }

    return userRepository.update(userId, data);
  }

  async updateUserRole(
    userId: string,
    role: Role,
    isAdmin: boolean
  ): Promise<User> {
    if (!isAdmin) {
      throw new ForbiddenError(API_ERROR_MESSAGES.ADMIN_ONLY);
    }

    const exists = await userRepository.exists(userId);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return userRepository.updateRole(userId, role);
  }

  async getAllUsers(isAdmin: boolean): Promise<User[]> {
    if (!isAdmin) {
      throw new ForbiddenError(API_ERROR_MESSAGES.ADMIN_ONLY);
    }

    return userRepository.findAll();
  }

  async userExists(id: string): Promise<boolean> {
    return userRepository.exists(id);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const exists = await userRepository.emailExists(email);
    return !exists;
  }
}

export const userService = new UserService();
