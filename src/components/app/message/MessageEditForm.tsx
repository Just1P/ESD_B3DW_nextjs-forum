"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import MessageService from "@/services/message.service";
import { UpdateMessageDTO } from "@/types/message.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
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
      <div className="relative">
        <Input
          type="text"
          className="pr-24"
          autoFocus
          {...register("content", { required: true })}
        />
        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={
              !contentWatch || contentWatch.trim() === "" || mutation.isPending
            }
          >
            {mutation.isPending && <Spinner className="mr-2" />}
            Enregistrer
          </Button>
        </div>
      </div>
    </form>
  );
}
