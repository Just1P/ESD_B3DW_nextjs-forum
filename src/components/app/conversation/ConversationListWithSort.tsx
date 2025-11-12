"use client";

import ConversationService from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ConversationCard from "./ConversationCard";

type SortType = "recent" | "popular";

export default function ConversationListWithSort() {
  const [sortType, setSortType] = useState<SortType>("recent");

  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      return await ConversationService.fetchConversations();
    },
  });

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (sortType === "popular") {
        const scoreA = a.voteScore || 0;
        const scoreB = b.voteScore || 0;
        return scoreB - scoreA;
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
  }, [conversations, sortType]);

  return (
    <>
      <div className="mb-3 px-4">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setSortType("recent")}
            className={`px-3 py-1.5 font-medium rounded-full transition-colors ${
              sortType === "recent"
                ? "text-blue-600 bg-gray-100 hover:bg-gray-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Récent
          </button>
          <button
            onClick={() => setSortType("popular")}
            className={`px-3 py-1.5 font-medium rounded-full transition-colors ${
              sortType === "popular"
                ? "text-blue-600 bg-gray-100 hover:bg-gray-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Populaire
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-md p-4 animate-pulse"
              >
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <p className="text-red-600">
              Erreur lors du chargement des conversations.
            </p>
          </div>
        ) : sortedConversations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <p className="text-gray-500">Aucune conversation disponible.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
