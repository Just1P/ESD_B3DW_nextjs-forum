import { voteRepository, conversationRepository } from "@/repositories";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { API_ERROR_MESSAGES } from "@/lib/constants";
import { Vote, VoteType } from "@/generated/prisma";

export class VoteService {
  async castVote(
    userId: string,
    conversationId: string,
    type: VoteType
  ): Promise<Vote> {
    const conversationExists =
      await conversationRepository.exists(conversationId);
    if (!conversationExists) {
      throw new ValidationError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const existingVote = await voteRepository.findByUserAndConversation(
      userId,
      conversationId
    );

    if (existingVote) {
      if (existingVote.type === type) {
        return existingVote;
      }
      return voteRepository.update(userId, conversationId, type);
    }

    return voteRepository.create(userId, conversationId, type);
  }

  async removeVote(userId: string, conversationId: string): Promise<void> {
    const conversationExists =
      await conversationRepository.exists(conversationId);
    if (!conversationExists) {
      throw new ValidationError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const existingVote = await voteRepository.findByUserAndConversation(
      userId,
      conversationId
    );

    if (!existingVote) {
      throw new NotFoundError(API_ERROR_MESSAGES.VOTE_NOT_FOUND);
    }

    await voteRepository.delete(userId, conversationId);
  }

  async getVoteStats(conversationId: string) {
    const conversationExists =
      await conversationRepository.exists(conversationId);
    if (!conversationExists) {
      throw new NotFoundError(API_ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    return voteRepository.getStats(conversationId);
  }

  async getUserVote(
    userId: string,
    conversationId: string
  ): Promise<VoteType | null> {
    const vote = await voteRepository.findByUserAndConversation(
      userId,
      conversationId
    );
    return vote?.type || null;
  }

  async getUserVotes(userId: string): Promise<Vote[]> {
    return voteRepository.findByUserId(userId);
  }
}

export const voteService = new VoteService();
