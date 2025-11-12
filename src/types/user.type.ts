export type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  email: string;
  password: string;
  name?: string;
  image?: string;
  bio?: string;
};

export type UpdateUserInput = {
  name?: string;
  image?: string;
  bio?: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type PublicUser = Pick<User, "id" | "name" | "image" | "bio">;
