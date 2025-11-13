import { z } from "zod";
import { VALIDATION } from "@/lib/constants";

export const createMessageSchema = z.object({
  content: z
    .string()
    .min(
      VALIDATION.MESSAGE.MIN_LENGTH,
      "Le contenu du message ne peut pas être vide"
    )
    .max(
      VALIDATION.MESSAGE.MAX_LENGTH,
      `Le message ne peut pas dépasser ${VALIDATION.MESSAGE.MAX_LENGTH} caractères`
    )
    .trim(),
  conversationId: z.string().cuid("ID de conversation invalide"),
});

export const updateMessageSchema = z.object({
  content: z
    .string()
    .min(
      VALIDATION.MESSAGE.MIN_LENGTH,
      "Le contenu du message ne peut pas être vide"
    )
    .max(
      VALIDATION.MESSAGE.MAX_LENGTH,
      `Le message ne peut pas dépasser ${VALIDATION.MESSAGE.MAX_LENGTH} caractères`
    )
    .trim(),
});

export const messageIdSchema = z.object({
  id: z.string().cuid("ID de message invalide"),
});

export const messageQuerySchema = z.object({
  conversationId: z.string().cuid("ID de conversation invalide").optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type MessageIdParams = z.infer<typeof messageIdSchema>;
export type MessageQueryParams = z.infer<typeof messageQuerySchema>;
