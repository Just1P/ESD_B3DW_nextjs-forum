import { requireAuth } from "@/lib/session";
import { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/lib/errors";
import { privateConversationService } from "@/services/server";
import { conversationIdSchema } from "@/schemas";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    conversationIdSchema.parse({ id });

    const conversation =
      await privateConversationService.getPrivateConversationById(id, user.id);

    return successResponse(conversation);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    conversationIdSchema.parse({ id });

    await privateConversationService.deletePrivateConversation(
      id,
      user.id
    );

    return successResponse({ message: "Conversation supprimée avec succès" });
  } catch (error) {
    return handleApiError(error);
  }
}
