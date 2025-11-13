import { z } from "zod";
import { VoteType } from "@/generated/prisma";

export const voteSchema = z.object({
  conversationId: z.string().cuid("ID de conversation invalide"),
  type: z.nativeEnum(VoteType).refine((val) => Object.values(VoteType).includes(val), {
    message: "Type de vote invalide (UP ou DOWN)",
  }),
});

export const deleteVoteSchema = z.object({
  conversationId: z.string().cuid("ID de conversation invalide"),
});

export type VoteInput = z.infer<typeof voteSchema>;
export type DeleteVoteInput = z.infer<typeof deleteVoteSchema>;
