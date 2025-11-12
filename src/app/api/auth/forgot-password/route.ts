import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    // Utiliser l'API Better Auth pour demander la réinitialisation du mot de passe
    const response = await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
      },
    });

    if (response.error) {
      console.error("Erreur lors de la demande de réinitialisation:", response.error);
      // Toujours retourner un message générique pour des raisons de sécurité
      return NextResponse.json({
        message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  }
}
