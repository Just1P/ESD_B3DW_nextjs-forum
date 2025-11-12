import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { ROLE_VALUES } from "./roles";
import { sendPasswordResetEmail } from "./email";
import { env } from "./env";
import { prisma } from "./prisma";

const isGoogleProviderConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

const isGithubProviderConfigured =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

const socialProviders = {
  ...(isGoogleProviderConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          prompt: "select_account",
        },
      }
    : {}),
  ...(isGithubProviderConfigured
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
      }
    : {}),
};

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
  socialProviders:
    Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
  advanced: {
    disableCSRFCheck: env.isDevelopment,
  },
});

export type Session = typeof auth.$Infer.Session;
