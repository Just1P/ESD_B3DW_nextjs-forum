import { requireAuth } from "@/lib/session";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux (max 5MB)" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé (PNG, JPG, WEBP uniquement)" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `profile-${user.id}-${timestamp}.${extension}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      message: "Image uploadée avec succès",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Authentification requise"
    ) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'upload",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
