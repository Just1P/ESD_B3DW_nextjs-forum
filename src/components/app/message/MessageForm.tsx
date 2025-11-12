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
      // Invalidate and refetch
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
      <div className="relative my-5">
        <Input
          type="text"
          placeholder="Chargement..."
          className="py-6"
          disabled
        />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="relative my-5">
        <div className="border rounded-md p-6 bg-gray-50 text-center">
          <p className="text-gray-700 mb-3">
            Vous devez vous connecter pour envoyer un message
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" asChild>
              <Link href="/signin">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">S&apos;inscrire</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="relative my-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Écrivez votre message..."
        className="py-6"
        {...register("content")}
      />
      <Button
        type="submit"
        className="absolute top-1/2 right-0 -translate-y-1/2 mr-2"
        disabled={
          !contentWatch || contentWatch.trim() === "" || mutation.isPending
        }
      >
        {mutation.isPending && <Spinner className="mr-2" />}
        Envoyer
      </Button>
    </form>
  );
}
