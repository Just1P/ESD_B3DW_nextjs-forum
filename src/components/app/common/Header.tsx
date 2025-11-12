"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserAvatar } from "./UserAvatar";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(SUCCESS_MESSAGES.SIGN_OUT);
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error(ERROR_MESSAGES.GENERIC);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-12 items-center justify-between mx-auto px-4">
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="h-8">
            <Link href="/">Accueil</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                >
                  <UserAvatar 
                    user={session.user}
                    size="sm"
                    className="border-2 border-gray-200"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || "Utilisateur"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="h-8">
                <Link href="/signin">Connexion</Link>
              </Button>
              <Button size="sm" asChild className="h-8">
                <Link href="/signup">Inscription</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
