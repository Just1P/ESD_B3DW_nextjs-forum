import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/errors";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return successResponse(tags);
  } catch (error) {
    return handleApiError(error);
  }
}


