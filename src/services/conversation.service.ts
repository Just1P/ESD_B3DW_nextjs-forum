import { apiClient } from "@/lib/api-client";
import {
  ConversationDTO,
  ConversationWithExtend,
} from "@/types/conversation.type";

async function fetchConversations() {
  return apiClient.get<ConversationWithExtend[]>("/conversations");
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
