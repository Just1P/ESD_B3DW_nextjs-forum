"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Role } from "@/generated/prisma";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { updateUser, useSession } from "@/lib/auth-client";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";

type ProfileFormData = {
  name: string;
  image: string;
  bio: string;
};

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  createdAt?: Date;
  role: Role;
};

export function ProfileEditForm() {
  const { data: session, isPending } = useSession();

  const user = session?.user as SessionUser | undefined;

  const form = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
      bio: user?.bio || "",
    },
    values: {
      name: user?.name || "",
      image: user?.image || "",
      bio: user?.bio || "",
    },
  });

  const updateProfileMutation = useMutationWithToast({
    mutationFn: async (data: ProfileFormData) => {
      const result = await updateUser({
        name: data.name,
        image: data.image,
      });

      if (!result.data) {
        throw new Error(
          result.error?.message || ERROR_MESSAGES.PROFILE_UPDATE_FAILED
        );
      }

      if (data.bio !== undefined) {
        const response = await fetch("/api/user/me/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bio: data.bio }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
        }
      }

      return result.data;
    },
    successMessage: SUCCESS_MESSAGES.PROFILE_UPDATED,
    invalidateQueries: QUERY_KEYS.SESSION,
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
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
                    placeholder="Votre nom"
                    {...field}
                    disabled={updateProfileMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo de profil</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    userName={user.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Parlez-nous de vous..."
                    className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    {...field}
                    disabled={updateProfileMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  {field.value?.length || 0} caractères
                </p>
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex-1"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={updateProfileMutation.isPending}
            >
              Réinitialiser
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
