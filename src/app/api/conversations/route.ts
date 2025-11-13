import { getCurrentUser, requireAuth } from "@/lib/session";
import { NextRequest } from "next/server";
import { handleApiError, successResponse, createdResponse } from "@/lib/errors";
import { conversationService } from "@/services/server";
import { createConversationSchema } from "@/schemas";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    const conversations = await conversationService.getAllConversations(
      currentUser?.id
    );

    return successResponse(conversations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validatedData = createConversationSchema.parse(body);

    const conversation = await conversationService.createConversation(
      validatedData.title,
      user.id
    );

    return createdResponse(conversation);
  } catch (error) {
    return handleApiError(error);
  }
}
