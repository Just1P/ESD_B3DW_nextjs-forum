"use client";

import ConversationService from "@/services/conversation.service";
import { ConversationWithExtend } from "@/types/conversation.type";
import { useEffect, useState } from "react";
import ConversationCard from "./ConversationCard";

export default function ConversationList() {
  const [conversations, setConversations] = useState<ConversationWithExtend[]>(
    []
  );

  useEffect(() => {
    getAllConversations();
  }, []);

  const getAllConversations = async () => {
    try {
      const data = await ConversationService.fetchConversations();
      setConversations(data);
    } catch (error) {
      // Error silently handled
    }
  };

  return (
    <div className="container mx-auto px-4">
      {conversations.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-500">Aucune conversation disponible.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
