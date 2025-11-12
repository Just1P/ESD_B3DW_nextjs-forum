import type { Role } from "@/generated/prisma";

export type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  email: string;
  password: string;
  name?: string;
  image?: string;
  bio?: string;
  role?: Role;
};

export type UpdateUserInput = {
  name?: string;
  image?: string;
  bio?: string;
  role?: Role;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type PublicUser = Pick<User, "id" | "name" | "image" | "bio" | "role">;

export type UserWithContributions = Pick<
  User,
  "id" | "name" | "image" | "bio" | "createdAt" | "role"
> & {
  conversations: Array<{
    id: string;
    title: string | null;
    createdAt: Date;
    voteScore: number;
    _count?: {
      messages: number;
      votes: number;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    conversationId: string | null;
    Conversation: {
      id: string;
      title: string | null;
    } | null;
  }>;
  _count: {
    conversations: number;
    messages: number;
    votes: number;
  };
};
