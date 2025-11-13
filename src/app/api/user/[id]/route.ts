import { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/lib/errors";
import { userService } from "@/services/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await userService.getUserWithContributions(id);

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
