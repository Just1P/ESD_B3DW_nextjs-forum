import ResetPasswordEmail from "@/emails/reset-password";
import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "./env";

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { id: "test-mode", message: "Email non envoyé (mode test)" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetLink = `${env.appUrl}/reset-password/${resetToken}`;

    const emailHtml = await render(
      ResetPasswordEmail({
        username,
        resetLink,
      })
    );

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Forum <onboarding@resend.dev>",
      to: [email],
      subject: "Réinitialisation de votre mot de passe",
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Erreur Resend: ${JSON.stringify(error)}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
