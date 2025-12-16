import {
  conversationRepository,
  conversationParticipantRepository,
} from "@/repositories";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/lib/errors";
import { API_ERROR_MESSAGES } from "@/lib/constants";
import { ConversationWithExtend } from "@/types/conversation.type";
import { Conversation } from "@/generated/prisma";

export class PrivateConversationService {
  async getPrivateConversations(
    userId: string
  ): Promise<ConversationWithExtend[]> {
    return conversationRepository.findPrivateConversations(userId);
  }

  async getPrivateConversationById(
    id: string,
    userId: string
  ): Promise<ConversationWithExtend> {
    const conversation = await conversationRepository.findById(id, userId);

    if (!conversation) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    if (conversation.deletedAt) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_DELETED);
    }

    if (!conversation.isPrivate) {
      throw new BadRequestError("Cette conversation n'est pas privée");
    }

    const isParticipant = await conversationParticipantRepository.isParticipant(
      id,
      userId
    );

    if (!isParticipant) {
      throw new ForbiddenError(
        "Vous n'avez pas accès à cette conversation privée"
      );
    }

    return conversation;
  }

  async createOrGetPrivateConversation(
    userId: string,
    otherUserId: string
  ): Promise<Conversation> {
    if (userId === otherUserId) {
      throw new BadRequestError(
        "Vous ne pouvez pas créer une conversation avec vous-même"
      );
    }

    const existing = await conversationRepository.findExistingPrivateConversation(
      userId,
      otherUserId
    );

    if (existing) {
      return existing;
    }

    return conversationRepository.createPrivateConversation(userId, otherUserId);
  }

  async deletePrivateConversation(
    id: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<void> {
    const exists = await conversationRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const conversation = await conversationRepository.findById(id);
    if (!conversation?.isPrivate) {
      throw new BadRequestError("Cette conversation n'est pas privée");
    }

    const isParticipant = await conversationParticipantRepository.isParticipant(
      id,
      userId
    );

    // Pour les conversations privées, seuls les participants peuvent supprimer, jamais les admins
    if (!isParticipant) {
      throw new ForbiddenError(
        "Vous ne pouvez pas supprimer les conversations privées des autres utilisateurs"
      );
    }

    await conversationRepository.softDelete(id);
  }
}

export const privateConversationService = new PrivateConversationService();
