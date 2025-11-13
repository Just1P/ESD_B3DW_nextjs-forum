import { canModerateContent } from "@/lib/roles";
import { requireAuth, getCurrentUser } from "@/lib/session";
import { handleApiError, successResponse, noContentResponse } from "@/lib/errors";
import { conversationService } from "@/services/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    const conversation = await conversationService.getConversationById(
      id,
      currentUser?.id
    );

    return successResponse(conversation);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const canModerate = canModerateContent(user.role);

    await conversationService.deleteConversation(id, user.id, canModerate);

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
