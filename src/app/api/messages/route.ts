import { requireAuth } from "@/lib/session";
import { NextRequest } from "next/server";
import { handleApiError, successResponse, createdResponse } from "@/lib/errors";
import { messageService } from "@/services/server";
import { createMessageSchema } from "@/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId") || undefined;

    const messages = await messageService.getAllMessages(conversationId);

    return successResponse(messages);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validatedData = createMessageSchema.parse(body);

    const message = await messageService.createMessage(
      validatedData.content,
      validatedData.conversationId,
      user.id
    );

    return createdResponse(message);
  } catch (error) {
    return handleApiError(error);
  }
}
