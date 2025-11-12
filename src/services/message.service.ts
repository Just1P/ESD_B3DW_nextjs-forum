import { apiClient } from "@/lib/api-client";
import { Message } from "@/generated/prisma";
import { MessageDTO, UpdateMessageDTO } from "@/types/message.type";

interface FetchMessageParams {
  conversationId?: string;
}

export async function fetchMessages(
  params?: FetchMessageParams
): Promise<Message[]> {
  const queryParams = params?.conversationId
    ? { conversationId: params.conversationId }
    : undefined;

  return apiClient.get<Message[]>("/messages", {
    params: queryParams,
  });
}

export async function createMessage(messageDTO: MessageDTO) {
  return apiClient.post<Message, MessageDTO>("/messages", messageDTO);
}

export async function updateMessage(id: string, updateDTO: UpdateMessageDTO) {
  return apiClient.patch<Message, UpdateMessageDTO>(
    `/messages/${id}`,
    updateDTO
  );
}

export async function deleteById(id: string) {
  await apiClient.delete<void>(`/messages/${id}`);
}

const MessageService = {
  fetchMessages,
  createMessage,
  updateMessage,
  deleteById,
  deleteMessage: deleteById,
};

export default MessageService;
