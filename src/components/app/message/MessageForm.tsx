"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import MessageService from "@/services/message.service";
import { MessageDTO } from "@/types/message.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MessageFormProps {
  conversationId: string;
}

export default function MessageForm({ conversationId }: MessageFormProps) {
  const { register, handleSubmit, watch, reset } = useForm<MessageDTO>();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();

  const mutation = useMutation({
    mutationFn: async (data: MessageDTO) => {
      await MessageService.createMessage({
        ...data,
        conversationId,
      });
    },
    onSuccess: () => {
      reset();
      toast.success("Message envoyé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    },
  });

  const onSubmit = async (data: MessageDTO) => {
    if (!session?.user) {
      toast.error("Vous devez vous connecter pour envoyer un message");
      return;
    }
    mutation.mutate(data);
  };

  const contentWatch = watch("content");

  if (isPending) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <Input
          type="text"
          placeholder="Chargement..."
          className="py-5 text-sm"
          disabled
        />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-sm">
            Connectez-vous pour participer à la discussion
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/signin">Connexion</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Inscription</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Qu'en pensez-vous ?"
          className="py-5 pr-24 text-sm"
          {...register("content")}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute top-1/2 right-0 -translate-y-1/2 mr-2 h-8"
          disabled={
            !contentWatch || contentWatch.trim() === "" || mutation.isPending
          }
        >
          {mutation.isPending && <Spinner className="mr-2" />}
          Commenter
        </Button>
      </form>
    </div>
  );
}
