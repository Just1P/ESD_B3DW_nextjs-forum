import { requireAuth } from "@/lib/session";
import { NextRequest } from "next/server";
import {
  handleApiError,
  successResponse,
  createdResponse,
} from "@/lib/errors";
import { privateConversationService } from "@/services/server";
import { createPrivateConversationSchema } from "@/schemas";

export async function GET() {
  try {
    const user = await requireAuth();
    const conversations =
      await privateConversationService.getPrivateConversations(user.id);

    return successResponse(conversations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validatedData = createPrivateConversationSchema.parse(body);

    const conversation =
      await privateConversationService.createOrGetPrivateConversation(
        user.id,
        validatedData.recipientId
      );

    return createdResponse(conversation);
  } catch (error) {
    return handleApiError(error);
  }
}
