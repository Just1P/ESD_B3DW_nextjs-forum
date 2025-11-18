import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: `${env.appUrl}/reset-password`,
      },
    });

    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  }
}
