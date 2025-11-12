import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationWithToastOptions<TData, TVariables, TError = Error>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "onSuccess" | "onError"
  > {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?:
    | ReadonlyArray<string>
    | ReadonlyArray<ReadonlyArray<string>>;
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
        const isNestedArray =
          Array.isArray(invalidateQueries) &&
          invalidateQueries.length > 0 &&
          Array.isArray(invalidateQueries[0]);

        const queries = isNestedArray
          ? (invalidateQueries as ReadonlyArray<ReadonlyArray<string>>)
          : [invalidateQueries as ReadonlyArray<string>];

        await Promise.all(
          queries.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey: [...queryKey] })
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
