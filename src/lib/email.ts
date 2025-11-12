import ResetPasswordEmail from "@/emails/reset-password";
import { render } from "@react-email/components";
import { Resend } from "resend";

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY n'est pas configuré - email non envoyé");
      console.log(`Email qui aurait été envoyé à: ${email}`);
      console.log(`Token de réinitialisation: ${resetToken}`);
      return { id: "test-mode", message: "Email non envoyé (mode test)" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    console.log("📧 Envoi de l'email à:", email);
    console.log("🔗 Lien de réinitialisation:", resetLink);

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
      console.error("❌ Erreur Resend:", error);
      throw new Error(`Erreur Resend: ${JSON.stringify(error)}`);
    }

    console.log("✅ Email envoyé avec succès:", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur complète lors de l'envoi de l'email:", error);
    throw error;
  }
}
