import { z } from "zod";
import { VALIDATION } from "@/lib/constants";
import { Role } from "@/generated/prisma";

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION.NAME.MIN_LENGTH,
      `Le nom doit contenir au moins ${VALIDATION.NAME.MIN_LENGTH} caractères`
    )
    .max(
      VALIDATION.NAME.MAX_LENGTH,
      `Le nom ne peut pas dépasser ${VALIDATION.NAME.MAX_LENGTH} caractères`
    )
    .trim()
    .optional(),
  bio: z
    .string()
    .max(
      VALIDATION.BIO.MAX_LENGTH,
      `La bio ne peut pas dépasser ${VALIDATION.BIO.MAX_LENGTH} caractères`
    )
    .trim()
    .optional(),
  image: z.string().url("URL d'image invalide").optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Role).refine((val) => Object.values(Role).includes(val), {
    message: "Rôle invalide (USER, MODERATOR, ou ADMIN)",
  }),
});

export const userIdSchema = z.object({
  id: z.string().cuid("ID utilisateur invalide"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
