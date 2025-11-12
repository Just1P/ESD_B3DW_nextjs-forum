import { VoteType } from "@/generated/prisma";
import { apiClient } from "@/lib/api-client";

async function vote(conversationId: string, type: VoteType): Promise<void> {
  await apiClient.post<void, { conversationId: string; type: VoteType }>(
    "/votes",
    { conversationId, type }
  );
}

async function removeVote(conversationId: string): Promise<void> {
  await apiClient.delete<void>(`/votes/${conversationId}`);
}

const voteService = {
  vote,
  removeVote,
};

export default voteService;
