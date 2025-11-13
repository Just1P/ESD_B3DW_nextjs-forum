import { requireAuth } from "@/lib/session";
import { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/lib/errors";
import { voteService } from "@/services/server";
import { voteSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const validatedData = voteSchema.parse(body);

    const vote = await voteService.castVote(
      user.id,
      validatedData.conversationId,
      validatedData.type
    );

    return successResponse({
      message: "Vote enregistré",
      vote
    });
  } catch (error) {
    return handleApiError(error);
  }
}
