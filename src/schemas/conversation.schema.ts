import { z } from "zod";
import { VALIDATION } from "@/lib/constants";

export const createConversationSchema = z.object({
  title: z
    .string()
    .min(
      VALIDATION.CONVERSATION_TITLE.MIN_LENGTH,
      `Le titre doit contenir au moins ${VALIDATION.CONVERSATION_TITLE.MIN_LENGTH} caractères`
    )
    .max(
      VALIDATION.CONVERSATION_TITLE.MAX_LENGTH,
      `Le titre ne peut pas dépasser ${VALIDATION.CONVERSATION_TITLE.MAX_LENGTH} caractères`
    )
    .trim(),
});

export const updateConversationSchema = z.object({
  title: z
    .string()
    .min(
      VALIDATION.CONVERSATION_TITLE.MIN_LENGTH,
      `Le titre doit contenir au moins ${VALIDATION.CONVERSATION_TITLE.MIN_LENGTH} caractères`
    )
    .max(
      VALIDATION.CONVERSATION_TITLE.MAX_LENGTH,
      `Le titre ne peut pas dépasser ${VALIDATION.CONVERSATION_TITLE.MAX_LENGTH} caractères`
    )
    .trim()
    .optional(),
});

export const conversationIdSchema = z.object({
  id: z.string().cuid("ID de conversation invalide"),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type ConversationIdParams = z.infer<typeof conversationIdSchema>;
