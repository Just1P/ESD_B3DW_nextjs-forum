import { messageRepository, conversationRepository } from "@/repositories";
import { NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";
import { API_ERROR_MESSAGES } from "@/lib/constants";
import { Message } from "@/generated/prisma";

export class MessageService {
  async getAllMessages(conversationId?: string): Promise<Message[]> {
    if (conversationId) {
      const conversationExists =
        await conversationRepository.exists(conversationId);
      if (!conversationExists) {
        throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
      }
    }

    return messageRepository.findAll(conversationId);
  }

  async getMessageById(id: string): Promise<Message> {
    const message = await messageRepository.findById(id);

    if (!message) {
      throw new NotFoundError(API_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
    }

    if (message.deletedAt) {
      throw new NotFoundError(API_ERROR_MESSAGES.MESSAGE_DELETED);
    }

    return message;
  }

  async createMessage(
    content: string,
    conversationId: string,
    userId: string
  ): Promise<Message> {
    const conversationExists =
      await conversationRepository.exists(conversationId);
    if (!conversationExists) {
      throw new ValidationError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    return messageRepository.create(content, conversationId, userId);
  }

  async updateMessage(
    id: string,
    content: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<Message> {
    const exists = await messageRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
    }

    const message = await messageRepository.findById(id);
    if (!message) {
      throw new NotFoundError(API_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
    }

    // Vérifier si le message appartient à une conversation privée
    const conversation = await conversationRepository.findById(
      message.conversationId
    );
    if (conversation?.isPrivate) {
      // Pour les conversations privées, seul l'auteur peut modifier, jamais les admins
      const isAuthor = await messageRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new ForbiddenError(
          "Vous ne pouvez pas modifier les messages privés des autres utilisateurs"
        );
      }
    } else {
      // Pour les conversations publiques, l'auteur ou un admin peut modifier
      const isAuthor = await messageRepository.isAuthor(id, userId);
      if (!isAuthor && !isAdmin) {
        throw new ForbiddenError(API_ERROR_MESSAGES.CANNOT_MODIFY_OTHERS);
      }
    }

    return messageRepository.update(id, content);
  }

  async deleteMessage(
    id: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<void> {
    const exists = await messageRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
    }

    const message = await messageRepository.findById(id);
    if (!message) {
      throw new NotFoundError(API_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
    }

    // Vérifier si le message appartient à une conversation privée
    const conversation = await conversationRepository.findById(
      message.conversationId
    );
    if (conversation?.isPrivate) {
      // Pour les conversations privées, seul l'auteur peut supprimer, jamais les admins
      const isAuthor = await messageRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new ForbiddenError(
          "Vous ne pouvez pas supprimer les messages privés des autres utilisateurs"
        );
      }
    } else {
      // Pour les conversations publiques, l'auteur ou un admin peut supprimer
      const isAuthor = await messageRepository.isAuthor(id, userId);
      if (!isAuthor && !isAdmin) {
        throw new ForbiddenError(API_ERROR_MESSAGES.CANNOT_DELETE_OTHERS);
      }
    }

    await messageRepository.softDelete(id);
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return messageRepository.findByUserId(userId);
  }

  async getMessageCount(conversationId: string): Promise<number> {
    return messageRepository.countByConversation(conversationId);
  }
}

export const messageService = new MessageService();
