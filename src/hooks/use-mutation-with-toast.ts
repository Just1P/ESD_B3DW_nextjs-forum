import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationWithToastOptions<TData, TVariables, TError = Error>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "onSuccess" | "onError"
  > {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: QueryKey | ReadonlyArray<QueryKey>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: TError, variables: TVariables) => void;
}

export function useMutationWithToast<
  TData = unknown,
  TVariables = void,
  TError = Error,
>({
  successMessage,
  errorMessage,
  invalidateQueries,
  onSuccess: customOnSuccess,
  onError: customOnError,
  ...options
}: MutationWithToastOptions<TData, TVariables, TError>) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    ...options,
    onSuccess: async (data, variables) => {
      if (successMessage) {
        toast.success(successMessage);
      }

      if (invalidateQueries) {
        let queries: ReadonlyArray<QueryKey>;

        if (Array.isArray(invalidateQueries)) {
          const first = invalidateQueries[0];
          if (Array.isArray(first)) {
            queries = invalidateQueries as ReadonlyArray<QueryKey>;
          } else {
            queries = [invalidateQueries as QueryKey];
          }
        } else {
          queries = [invalidateQueries];
        }

        await Promise.all(
          queries.map((queryKey) =>
            queryClient.invalidateQueries({
              queryKey: [...queryKey],
            })
          )
        );
      }

      if (customOnSuccess) {
        await customOnSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      const message =
        errorMessage ||
        (error instanceof Error ? error.message : "Une erreur est survenue");
      toast.error(message);

      if (customOnError) {
        customOnError(error, variables);
      }
    },
  });
}
