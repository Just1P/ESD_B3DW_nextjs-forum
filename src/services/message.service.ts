import { Message } from "@/generated/prisma";
import { MessageDTO, UpdateMessageDTO } from "@/types/message.type";

interface FetchMessageParams {
  conversationId?: string;
}

export async function fetchMessages(
  params?: FetchMessageParams
): Promise<Message[]> {
  const queryParams = new URLSearchParams();

  if (params?.conversationId) {
    queryParams.append("conversationId", params.conversationId);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/messages?${queryString}` : "/api/messages";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Échec de la récupération des messages");
  }
  return response.json();
}

export async function createMessage(messageDTO: MessageDTO) {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageDTO),
  });
  if (!response.ok) {
    throw new Error("Échec de la création du message");
  }
  return response.json();
}

export async function updateMessage(id: string, updateDTO: UpdateMessageDTO) {
  const response = await fetch(`/api/messages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateDTO),
  });
  if (!response.ok) {
    throw new Error("Échec de la modification du message");
  }
  return response.json();
}

export async function deleteById(id: string) {
  const response = await fetch(`/api/messages/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Échec de la suppression du message");
  }
  return response.json();
}

const MessageService = {
  fetchMessages,
  createMessage,
  updateMessage,
  deleteById,
  deleteMessage: deleteById,
};

export default MessageService;
