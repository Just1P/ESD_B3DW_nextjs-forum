import { Conversation, Message, VoteType } from "@/generated/prisma";

export interface ConversationWithExtend extends Conversation {
  messages: Message[];
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  _count?: {
    votes: number;
  };
  votes?: {
    type: VoteType;
    userId: string;
  }[];
  voteScore?: number;
  userVote?: VoteType | null;
}

export interface ConversationDTO {
  title: string;
}
