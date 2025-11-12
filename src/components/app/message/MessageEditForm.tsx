"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import MessageService from "@/services/message.service";
import { UpdateMessageDTO } from "@/types/message.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateMessageDTO) => {
      await MessageService.updateMessage(messageId, data);
    },
    onSuccess: () => {
      toast.success("Message modifié avec succès !");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      onCancel();
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification du message");
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
