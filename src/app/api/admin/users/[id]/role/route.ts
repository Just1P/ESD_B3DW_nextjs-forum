import { requireAdmin } from "@/lib/session";
import { handleApiError, successResponse, ValidationError } from "@/lib/errors";
import { userService } from "@/services/server";
import { updateUserRoleSchema } from "@/schemas";

type Params = Promise<{ id: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const validatedData = updateUserRoleSchema.parse(body);

    if (admin.id === id && validatedData.role !== "ADMIN") {
      throw new ValidationError(
        "Vous ne pouvez pas rétrograder votre propre compte administrateur."
      );
    }

    const updatedUser = await userService.updateUserRole(
      id,
      validatedData.role,
      true
    );

    return successResponse(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}
