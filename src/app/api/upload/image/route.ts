import { requireAuth } from "@/lib/session";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const blobToken =
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.USER_AVATAR_READ_WRITE_TOKEN ||
      Object.keys(process.env).find((key) => key.endsWith("_READ_WRITE_TOKEN"))
        ? process.env[
            Object.keys(process.env).find((key) =>
              key.endsWith("_READ_WRITE_TOKEN")
            )!
          ]
        : undefined;

    if (!blobToken) {
      const availableEnvVars = Object.keys(process.env)
        .filter((key) => key.includes("BLOB") || key.includes("TOKEN"))
        .join(", ");

      console.error("❌ Aucun token Vercel Blob n'est configuré");
      console.error(
        "Variables d'environnement disponibles (contenant BLOB ou TOKEN):",
        availableEnvVars || "aucune"
      );

      return NextResponse.json(
        {
          error: "Service d'upload non configuré",
          details: "Veuillez configurer Vercel Blob",
          availableVars:
            process.env.NODE_ENV === "development"
              ? availableEnvVars
              : undefined,
        },
        { status: 503 }
      );
    }

    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
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
      token: blobToken,
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

    console.error("❌ Erreur détaillée lors de l'upload:", error);

    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Erreur lors de l'upload",
        details: error instanceof Error ? error.message : "Erreur inconnue",
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
