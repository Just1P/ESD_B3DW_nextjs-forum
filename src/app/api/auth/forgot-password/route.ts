import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: email,
        value: resetToken,
        expiresAt,
      },
    });

    try {
      await sendPasswordResetEmail(
        email,
        user.name || "Utilisateur",
        resetToken
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
