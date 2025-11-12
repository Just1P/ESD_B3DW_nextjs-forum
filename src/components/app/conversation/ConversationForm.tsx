"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import ConversationService from "@/services/conversation.service";
import { ConversationDTO } from "@/types/conversation.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ConversationForm() {
  const { register, handleSubmit, watch, reset } = useForm<ConversationDTO>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: ConversationDTO) => {
      return await ConversationService.createConversation(data);
    },
    onSuccess: (data) => {
      reset();
      toast.success("Conversation créée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/conversations/${data.id}`);
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la conversation");
      console.error(error);
    },
  });

  const onSubmit = async (data: ConversationDTO) => {
    mutation.mutate(data);
  };

  const titleWatch = watch("title");

  return (
    <form className="relative" onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Donnez un titre à votre sujet..."
        className="py-5 pr-24 text-sm"
        {...register("title", { required: true })}
      />
      <Button
        type="submit"
        size="sm"
        className="absolute top-1/2 right-0 -translate-y-1/2 mr-2 h-8"
        disabled={!titleWatch || titleWatch.trim() === "" || mutation.isPending}
      >
        {mutation.isPending && <Spinner className="mr-2" />}
        Publier
      </Button>
    </form>
  );
}
