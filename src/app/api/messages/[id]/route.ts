import { canModerateContent, isAdmin } from "@/lib/roles";
import { requireAuth } from "@/lib/session";
import { NextRequest } from "next/server";
import { handleApiError, successResponse, noContentResponse } from "@/lib/errors";
import { messageService } from "@/services/server";
import { updateMessageSchema } from "@/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const validatedData = updateMessageSchema.parse(body);

    const isAdminUser = isAdmin(user.role);

    const updatedMessage = await messageService.updateMessage(
      id,
      validatedData.content,
      user.id,
      isAdminUser
    );

    return successResponse(updatedMessage);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const canModerate = canModerateContent(user.role);

    await messageService.deleteMessage(id, user.id, canModerate);

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
