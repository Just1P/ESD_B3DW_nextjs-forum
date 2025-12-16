import { apiClient } from "@/lib/api-client";
import {
  ConversationDTO,
  ConversationWithExtend,
} from "@/types/conversation.type";

async function fetchConversations(tags?: string[]) {
  return apiClient.get<ConversationWithExtend[]>("/conversations", {
    params:
      tags && tags.length > 0
        ? {
            tags: tags.join(","),
          }
        : undefined,
  });
}

async function fetchConversationById(id: string) {
  return apiClient.get<ConversationWithExtend>(`/conversations/${id}`);
}

async function createConversation(conversationDTO: ConversationDTO) {
  return apiClient.post<ConversationWithExtend, ConversationDTO>(
    "/conversations",
    conversationDTO
  );
}

async function deleteById(id: string) {
  await apiClient.delete<void>(`/conversations/${id}`);
}

const ConversationService = {
  fetchConversations,
  fetchConversationById,
  createConversation,
  deleteById,
};

export default ConversationService;
