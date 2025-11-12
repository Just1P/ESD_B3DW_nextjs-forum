import { requireAuth } from "@/lib/session";
import { userService } from "@/services/user.service";
import type { UpdateUserInput } from "@/types/user.type";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();

    const body = (await request.json()) as UpdateUserInput;

    const updateData: UpdateUserInput = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length === 0) {
        return NextResponse.json(
          { error: "Le nom doit être une chaîne non vide" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.image !== undefined) {
      if (typeof body.image !== "string") {
        return NextResponse.json(
          { error: "L'image doit être une URL valide" },
          { status: 400 }
        );
      }
      updateData.image = body.image;
    }

    if (body.bio !== undefined) {
      if (typeof body.bio !== "string") {
        return NextResponse.json(
          { error: "La bio doit être une chaîne de caractères" },
          { status: 400 }
        );
      }
      updateData.bio = body.bio.trim();
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée à mettre à jour" },
        { status: 400 }
      );
    }

    const updatedUser = await userService.updateUser(user.id, updateData);

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Authentification requise"
    ) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
