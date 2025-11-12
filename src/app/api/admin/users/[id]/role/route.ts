import { Role } from "@/generated/prisma";
import { ROLE_VALUES } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

interface UpdateRoleBody {
  role?: Role | string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: "Accès administrateur requis" },
      { status: 403 }
    );
  }

  const { id } = await params;

  let body: UpdateRoleBody;
  try {
    body = (await request.json()) as UpdateRoleBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide" },
      { status: 400 }
    );
  }

  if (!body.role) {
    return NextResponse.json(
      { error: "Le rôle est requis" },
      { status: 400 }
    );
  }

  const validRoles = ROLE_VALUES;
  if (!validRoles.includes(body.role as Role)) {
    return NextResponse.json(
      { error: "Rôle invalide" },
      { status: 400 }
    );
  }

  const role = body.role as Role;

  if (admin.id === id && role !== "ADMIN") {
    return NextResponse.json(
      {
        error:
          "Vous ne pouvez pas rétrograder votre propre compte administrateur.",
      },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
    },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  try {
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
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

