"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SignInFormData = {
  email: string;
  password: string;
};

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      if (!validateEmail(data.email)) {
        form.setError("email", {
          type: "manual",
          message: "Format d'email invalide",
        });
        setIsLoading(false);
        return;
      }

      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        const errorMessage = result.error.message?.toLowerCase() || "";

        if (
          errorMessage.includes("invalid") ||
          errorMessage.includes("incorrect") ||
          errorMessage.includes("wrong")
        ) {
          form.setError("password", {
            type: "manual",
            message: "Mot de passe incorrect",
          });
          toast.error("Email ou mot de passe incorrect");
        } else if (
          errorMessage.includes("not found") ||
          errorMessage.includes("doesn't exist") ||
          errorMessage.includes("no user")
        ) {
          form.setError("email", {
            type: "manual",
            message: "Aucun compte trouvé avec cet email",
          });
          toast.error("Aucun compte trouvé avec cet email");
        } else {
          toast.error(
            result.error.message ||
              "Une erreur est survenue lors de la connexion"
          );
        }
      } else {
        toast.success("Connexion réussie !");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-2xl font-bold text-center">
          Se connecter
        </CardTitle>
        <CardDescription className="text-center">
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "L'email est requis",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="vous@exemple.com"
                      {...field}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Le mot de passe est requis",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 px-0">
        <div className="text-sm text-center text-muted-foreground">
          Vous n&apos;avez pas de compte ?{" "}
          <Link
            href="/signup"
            className="text-primary underline-offset-4 hover:underline font-medium"
          >
            S&apos;inscrire
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
