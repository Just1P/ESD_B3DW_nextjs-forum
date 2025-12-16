import { Conversation, Message, Role, VoteType, Tag } from "@/generated/prisma";

export interface ConversationWithExtend extends Conversation {
  messages: Message[];
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
  } | null;
  participants?: {
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }[];
  _count?: {
    votes: number;
  };
  votes?: {
    type: VoteType;
    userId: string;
  }[];
  voteScore?: number;
  userVote?: VoteType | null;
  tags?: Tag[];
}

export interface ConversationDTO {
  title: string;
}
