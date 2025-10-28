import { Message } from "@/generated/prisma";
import { MessageDTO } from "@/types/message.type";

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
    throw new Error("Failed to fetch messages");
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
    throw new Error("Failed to create message");
  }
  return response.json();
}

const MessageService = {
  fetchMessages,
  createMessage,
};

export default MessageService;
