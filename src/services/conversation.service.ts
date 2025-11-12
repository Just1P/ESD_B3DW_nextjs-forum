import { ConversationDTO } from "@/types/conversation.type";

async function fetchConversations() {
  const response = await fetch("/api/conversations");
  if (!response.ok) {
    throw new Error("Échec de la récupération des conversations");
  }
  return response.json();
}

async function fetchConversationById(id: string) {
  const response = await fetch(`/api/conversations/${id}`);
  if (!response.ok) {
    throw new Error("Échec de la récupération de la conversation");
  }
  return response.json();
}

async function createConversation(conversationDTO: ConversationDTO) {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversationDTO),
  });
  if (!response.ok) {
    throw new Error("Échec de la création de la conversation");
  }
  return response.json();
}

async function deleteById(id: string) {
  const response = await fetch(`/api/conversations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Échec de la suppression de la conversation");
  }
  return response.json();
}

const ConversationService = {
  fetchConversations,
  fetchConversationById,
  createConversation,
  deleteById,
};

export default ConversationService;
