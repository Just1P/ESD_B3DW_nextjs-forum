import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendPasswordResetEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      // Envoyer l'email de réinitialisation
      await sendPasswordResetEmail(
        user.email,
        user.name || "Utilisateur",
        token
      );
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],
  advanced: {
    disableCSRFCheck: process.env.NODE_ENV === "development",
  },
});

export type Session = typeof auth.$Infer.Session;
