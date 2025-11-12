"use client";

import { RoleBadge } from "@/components/app/common/RoleBadge";
import { ProfileEditForm } from "@/components/app/forms";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import type { AuthenticatedUser } from "@/lib/session";
import { Calendar, Mail, ShieldCheck, User } from "lucide-react";

export default function AccountPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user as AuthenticatedUser;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h1 className="text-2xl font-semibold mb-2">Mon compte</h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles et vos préférences.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              Informations du compte
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500">Rôle</p>
                  <RoleBadge role={user.role} withDescription />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500">Membre depuis</p>
                  <p className="font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date non disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h2 className="text-lg font-semibold mb-4">Modifier le profil</h2>
            <ProfileEditForm />
          </div>
        </div>
      </div>
    </div>
  );
}
