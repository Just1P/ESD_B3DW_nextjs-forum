import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MessageService from "@/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface MessageButtonDeleteProps {
  className?: string;
  id: string;
}

export default function MessageButtonDelete({
  className,
  id,
}: MessageButtonDeleteProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await MessageService.deleteMessage(id);
    },
    onSuccess: () => {
      toast.success("Message supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Button
      variant="destructive"
      className={cn("bg-red-400", className)}
      onClick={handleDelete}
    >
      <Trash />
    </Button>
  );
}
