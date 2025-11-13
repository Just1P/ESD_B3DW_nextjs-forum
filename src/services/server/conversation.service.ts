import { conversationRepository } from "@/repositories";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { API_ERROR_MESSAGES } from "@/lib/constants";
import { ConversationWithExtend } from "@/types/conversation.type";
import { Conversation } from "@/generated/prisma";

export class ConversationService {
  async getAllConversations(
    userId?: string
  ): Promise<ConversationWithExtend[]> {
    return conversationRepository.findAll(userId);
  }

  async getConversationById(
    id: string,
    userId?: string
  ): Promise<ConversationWithExtend> {
    const conversation = await conversationRepository.findById(id, userId);

    if (!conversation) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    if (conversation.deletedAt) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_DELETED);
    }

    return conversation;
  }

  async createConversation(
    title: string,
    userId: string
  ): Promise<Conversation> {
    return conversationRepository.create(title, userId);
  }

  async updateConversation(
    id: string,
    title: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<Conversation> {
    const exists = await conversationRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const isAuthor = await conversationRepository.isAuthor(id, userId);
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenError(API_ERROR_MESSAGES.CANNOT_MODIFY_OTHERS);
    }

    return conversationRepository.update(id, title);
  }

  async deleteConversation(
    id: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<void> {
    const exists = await conversationRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const isAuthor = await conversationRepository.isAuthor(id, userId);
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenError(API_ERROR_MESSAGES.CANNOT_DELETE_OTHERS);
    }

    await conversationRepository.softDelete(id);
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return conversationRepository.findByUserId(userId);
  }
}

export const conversationService = new ConversationService();
