"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SUCCESS_MESSAGES, ERROR_MESSAGES, QUERY_KEYS } from "@/lib/constants";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import MessageService from "@/services/message.service";
import { UpdateMessageDTO } from "@/types/message.type";
import { useForm } from "react-hook-form";

interface MessageEditFormProps {
  messageId: string;
  currentContent: string;
  onCancel: () => void;
}

export default function MessageEditForm({
  messageId,
  currentContent,
  onCancel,
}: MessageEditFormProps) {
  const { register, handleSubmit, watch } = useForm<UpdateMessageDTO>({
    defaultValues: {
      content: currentContent,
    },
  });

  const mutation = useMutationWithToast({
    mutationFn: (data: UpdateMessageDTO) =>
      MessageService.updateMessage(messageId, data),
    successMessage: SUCCESS_MESSAGES.MESSAGE_UPDATED,
    errorMessage: ERROR_MESSAGES.MESSAGE_UPDATE_FAILED,
    invalidateQueries: QUERY_KEYS.MESSAGES,
    onSuccess: () => {
      onCancel();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: UpdateMessageDTO) => {
    if (data.content.trim() === currentContent.trim()) {
      onCancel();
      return;
    }
    mutation.mutate(data);
  };

  const contentWatch = watch("content");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <Input
          type="text"
          className="mb-2 text-sm"
          autoFocus
          {...register("content", { required: true })}
        />
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={mutation.isPending}
            className="h-7 text-xs"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={
              !contentWatch || contentWatch.trim() === "" || mutation.isPending
            }
            className="h-7 text-xs"
          >
            {mutation.isPending && <Spinner className="mr-2 h-3 w-3" />}
            Enregistrer
          </Button>
        </div>
      </div>
    </form>
  );
}
