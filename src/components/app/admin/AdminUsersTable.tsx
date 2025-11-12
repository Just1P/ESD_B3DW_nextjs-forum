"use client";

import { useState } from "react";
import { Role } from "@/generated/prisma";
import { RoleBadge } from "@/components/app/common/RoleBadge";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import adminService from "@/services/admin.service";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { formatDistanceToNow } from "@/lib/date";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
  conversationsCount: number;
  messagesCount: number;
}

interface AdminUsersTableProps {
  users: AdminUser[];
  currentAdminId: string;
}

const ROLE_OPTIONS: Role[] = ["ADMIN", "MODERATOR", "USER"];

export default function AdminUsersTable({
  users,
  currentAdminId,
}: AdminUsersTableProps) {
  const [userRoles, setUserRoles] = useState(() =>
    users.reduce<Record<string, Role>>((acc, user) => {
      acc[user.id] = user.role;
      return acc;
    }, {})
  );

  const mutation = useMutationWithToast({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: Role;
    }) => adminService.updateUserRole(userId, role),
    successMessage: SUCCESS_MESSAGES.ADMIN_ROLE_UPDATED,
    errorMessage: ERROR_MESSAGES.ADMIN_ROLE_UPDATE_FAILED,
    onSuccess: (updatedUser) => {
      setUserRoles((prev) => ({
        ...prev,
        [updatedUser.id]: updatedUser.role,
      }));
    },
  });

  const handleChangeRole = (userId: string, role: Role) => {
    mutation.mutate({ userId, role });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Gestion des utilisateurs
        </h2>
        <p className="text-sm text-gray-500">
          Consultez les comptes récents et ajustez leurs rôles.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activité
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => {
              const isSelf = user.id === currentAdminId;
              const role = userRoles[user.id];

              return (
                <tr key={user.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {user.name || "Utilisateur"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        {user.conversationsCount} conversation
                        {user.conversationsCount > 1 ? "s" : ""}
                      </p>
                      <p>
                        {user.messagesCount} message
                        {user.messagesCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <RoleBadge role={role} />
                      <select
                        className={cn(
                          "mt-1 block w-full rounded-md border border-gray-200 bg-white py-1.5 px-2 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                          isSelf && "cursor-not-allowed opacity-60"
                        )}
                        value={role}
                        onChange={(event) =>
                          handleChangeRole(
                            user.id,
                            event.target.value as Role
                          )
                        }
                        disabled={mutation.isPending || isSelf}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option === "ADMIN"
                              ? "Administrateur"
                              : option === "MODERATOR"
                              ? "Modérateur"
                              : "Utilisateur"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {formatDistanceToNow(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf && (
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        Vous
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mutation.isPending && (
        <div className="px-4 py-2 text-xs text-blue-500 bg-blue-50/70 border-t border-blue-100">
          Mise à jour du rôle en cours...
        </div>
      )}
    </div>
  );
}

