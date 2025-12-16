"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import MessageService, {
  type MessageWithAuthor,
} from "@/services/message.service";
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
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: MessageDTO) =>
      MessageService.createMessage({
        ...data,
        conversationId,
      }),
    onMutate: async (data: MessageDTO) => {
      const previousMessages =
        queryClient.getQueryData<MessageWithAuthor[]>(
          QUERY_KEYS.MESSAGES(conversationId)
        ) || [];

      const sessionUser: any = session?.user;

      const now = new Date();

      const optimisticMessage: MessageWithAuthor = {
        id: `optimistic-${Date.now()}`,
        content: data.content,
        conversationId,
        userId: sessionUser?.id ?? "",
        deletedAt: null,
        archivedAt: null,
        createdAt: now,
        updatedAt: now,
        author: sessionUser
          ? {
              id: sessionUser.id,
              name: sessionUser.name ?? null,
              email: sessionUser.email,
              image: sessionUser.image ?? null,
              role: sessionUser.role,
            }
          : null,
        conversation: null,
      };

      queryClient.setQueryData<MessageWithAuthor[]>(
        QUERY_KEYS.MESSAGES(conversationId),
        [...previousMessages, optimisticMessage]
      );

      reset();

      return { previousMessages };
    },
    onSuccess: (data, _variables, context) => {
      if (SUCCESS_MESSAGES.MESSAGE_CREATED) {
        toast.success(SUCCESS_MESSAGES.MESSAGE_CREATED);
      }

      queryClient.setQueryData<MessageWithAuthor[]>(
        QUERY_KEYS.MESSAGES(conversationId),
        (old = []) => {
          const base = context?.previousMessages ?? old;
          const withoutOptimistic = base.filter(
            (m) => !m.id.toString().startsWith("optimistic-")
          );
          return [...withoutOptimistic, data];
        }
      );
    },
    onError: (_error, _variables, context) => {
      const message =
        ERROR_MESSAGES.MESSAGE_CREATE_FAILED ||
        "Une erreur est survenue lors de l'envoi du message";
      toast.error(message);

      if (context?.previousMessages) {
        queryClient.setQueryData<MessageWithAuthor[]>(
          QUERY_KEYS.MESSAGES(conversationId),
          context.previousMessages
        );
      }
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
