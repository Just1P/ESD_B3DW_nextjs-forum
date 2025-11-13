"use client";

import MessageService from "@/services/message.service";

import MessageItem from "./MessageItem";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";

interface MessageListProps {
  conversationId?: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MESSAGES(conversationId),
    queryFn: async () => {
      return await MessageService.fetchMessages({ conversationId });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden bg-white">
        <div className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-6 text-center">
        <p className="text-red-600">
          Erreur lors du chargement des messages.
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <p className="text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à répondre !
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden bg-white">
      {data.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
