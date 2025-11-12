import type { Role } from "@/generated/prisma";

declare module "better-auth/types" {
  interface User {
    bio?: string | null;
    role: Role;
  }

  interface Session {
    user: User & {
      bio?: string | null;
      role: Role;
    };
  }
}
