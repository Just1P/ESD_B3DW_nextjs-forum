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
import { signUp } from "@/lib/auth-client";
import { validateEmail, validatePassword, validatePasswordMatch } from "@/lib/validation";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      if (!validateEmail(data.email)) {
        form.setError("email", {
          type: "manual",
          message: ERROR_MESSAGES.INVALID_EMAIL,
        });
        setIsLoading(false);
        return;
      }

      const passwordValidation = validatePassword(data.password);
      if (passwordValidation !== true) {
        form.setError("password", {
          type: "manual",
          message: passwordValidation,
        });
        setIsLoading(false);
        return;
      }

      const matchValidation = validatePasswordMatch(data.password, data.confirmPassword);
      if (matchValidation !== true) {
        form.setError("confirmPassword", {
          type: "manual",
          message: matchValidation,
        });
        setIsLoading(false);
        return;
      }

      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        if (
          result.error.message?.includes("already exists") ||
          result.error.message?.includes("duplicate") ||
          result.error.message?.includes("unique")
        ) {
          form.setError("email", {
            type: "manual",
            message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          });
          toast.error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        } else {
          toast.error(result.error.message || ERROR_MESSAGES.GENERIC);
        }
      } else {
        toast.success(SUCCESS_MESSAGES.SIGN_UP);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error(ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-2xl font-bold text-center">
          Créer un compte
        </CardTitle>
        <CardDescription className="text-center">
          Entrez vos informations pour créer votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Le nom est requis",
                minLength: {
                  value: 2,
                  message: "Le nom doit contenir au moins 2 caractères",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jean Dupont"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "La confirmation du mot de passe est requise",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 px-0">
        <div className="text-sm text-center text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/signin"
            className="text-primary underline-offset-4 hover:underline font-medium"
          >
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
