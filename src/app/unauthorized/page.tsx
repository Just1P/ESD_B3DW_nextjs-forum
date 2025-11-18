"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-2 border-red-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Accès Refusé
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-red-600">
              Vous n&apos;avez rien à faire ici !!
            </p>
            <p className="text-sm text-gray-600">
              Endroit réservé aux admins, connectez-vous avec un compte ADMIN et
              vous pourrez rentrer.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/signin">Se connecter</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/signup">Créer un compte</Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
