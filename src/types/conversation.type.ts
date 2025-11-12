import { Conversation, Message, Role, VoteType } from "@/generated/prisma";

export interface ConversationWithExtend extends Conversation {
  messages: Message[];
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
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
