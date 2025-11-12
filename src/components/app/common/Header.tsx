"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 container mx-auto">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span className="font-bold text-xl">Forum</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Conversations
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || "Avatar"}
                    />
                    <AvatarFallback>
                      {session.user.name
                        ? getInitials(session.user.name)
                        : session.user.email?.[0].toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/signin">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">S&apos;inscrire</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
