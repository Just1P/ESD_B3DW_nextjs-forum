import { apiClient } from "@/lib/api-client";
import type { Role } from "@/generated/prisma";
import type { User } from "@/types/user.type";

export interface UpdateUserRoleInput {
  role: Role;
}

async function updateUserRole(userId: string, role: Role) {
  return apiClient.patch<User, UpdateUserRoleInput>(
    `/admin/users/${userId}/role`,
    { role }
  );
}

export const adminService = {
  updateUserRole,
};

export default adminService;
