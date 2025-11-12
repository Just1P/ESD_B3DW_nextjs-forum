import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { Role } from "@/generated/prisma";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

interface UpdateRoleBody {
  role?: Role | string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as UpdateRoleBody;

    if (!body.role) {
      return NextResponse.json(
        { error: "Le rôle est requis" },
        { status: 400 }
      );
    }

    if (!Object.values(Role).includes(body.role as Role)) {
      return NextResponse.json(
        { error: "Rôle invalide" },
        { status: 400 }
      );
    }

    const role = body.role as Role;

    // Empêcher qu'un admin supprime son propre accès complet
    if (admin.id === id && role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Vous ne pouvez pas rétrograder votre propre compte administrateur.",
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        bio: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle utilisateur:", error);
    return NextResponse.json(
      { error: "Accès administrateur requis" },
      { status: 403 }
    );
  }
}

