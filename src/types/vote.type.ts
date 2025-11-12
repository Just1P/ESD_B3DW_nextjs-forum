import { Vote, VoteType } from "@/generated/prisma";

export type { Vote, VoteType };

export type VoteDTO = {
  conversationId: string;
  type: VoteType;
};

export type VoteStats = {
  upvotes: number;
  downvotes: number;
  userVote: VoteType | null;
};

