import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
  className?: string;
  entityName: string;
  id: string;
  onDelete: (id: string) => Promise<void>;
  queryKey: QueryKey;
}

export default function DeleteButton({
  className,
  entityName,
  id,
  onDelete,
  queryKey,
}: DeleteButtonProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await onDelete(id);
    },
    onSuccess: () => {
      toast.success(`${entityName} supprimé avec succès !`);
      queryClient.invalidateQueries({
        queryKey: [...queryKey],
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50",
        className
      )}
      onClick={handleDelete}
    >
      <Trash className="h-3 w-3 mr-1" />
      Supprimer
    </Button>
  );
}
