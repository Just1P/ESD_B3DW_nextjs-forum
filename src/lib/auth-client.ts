import { env } from "@/lib/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.appUrl,
});

export const { signIn, signUp, signOut, useSession, getSession, updateUser } = authClient;
