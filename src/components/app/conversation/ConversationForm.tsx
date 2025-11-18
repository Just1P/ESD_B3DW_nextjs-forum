"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import ConversationService from "@/services/conversation.service";
import { ConversationDTO } from "@/types/conversation.type";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ConversationForm() {
  const { register, handleSubmit, watch, reset } = useForm<ConversationDTO>();
  const router = useRouter();

  const mutation = useMutationWithToast({
    mutationFn: (data: ConversationDTO) =>
      ConversationService.createConversation(data),
    successMessage: SUCCESS_MESSAGES.CONVERSATION_CREATED,
    errorMessage: ERROR_MESSAGES.CONVERSATION_CREATE_FAILED,
    invalidateQueries: QUERY_KEYS.CONVERSATIONS,
    onSuccess: (data) => {
      reset();
      router.push(`/conversations/${data.id}`);
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
