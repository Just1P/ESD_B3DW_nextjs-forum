import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { ROLE_VALUES } from "./roles";
import { sendPasswordResetEmail } from "./email";
import { env } from "./env";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: env.appUrl,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }) => {
      await sendPasswordResetEmail(
        user.email,
        user.name || "Utilisateur",
        token
      );
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
        enum: ROLE_VALUES,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    ...(env.appUrl ? [env.appUrl] : []),
  ],
  advanced: {
    disableCSRFCheck: env.isDevelopment,
  },
});

export type Session = typeof auth.$Infer.Session;
