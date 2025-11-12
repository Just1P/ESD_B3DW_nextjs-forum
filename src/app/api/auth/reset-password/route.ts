import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token et mot de passe requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Utiliser l'API Better Auth pour réinitialiser le mot de passe
    const response = await auth.api.resetPassword({
      body: {
        token,
        newPassword: password,
      },
    });

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message || "Erreur lors de la réinitialisation" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
