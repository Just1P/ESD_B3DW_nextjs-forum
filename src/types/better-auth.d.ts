declare module "better-auth/types" {
  interface User {
    bio?: string | null;
  }

  interface Session {
    user: User & {
      bio?: string | null;
    };
  }
}
