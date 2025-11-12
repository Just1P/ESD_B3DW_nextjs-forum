import { Message, Role } from "@/generated/prisma";
import { apiClient } from "@/lib/api-client";
import { MessageDTO, UpdateMessageDTO } from "@/types/message.type";

interface FetchMessageParams {
  conversationId?: string;
}

export type MessageWithAuthor = Message & {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
  } | null;
};

export async function fetchMessages(
  params?: FetchMessageParams
): Promise<MessageWithAuthor[]> {
  const queryParams = params?.conversationId
    ? { conversationId: params.conversationId }
    : undefined;

  return apiClient.get<MessageWithAuthor[]>("/messages", {
    params: queryParams,
  });
}

export async function createMessage(messageDTO: MessageDTO) {
  return apiClient.post<MessageWithAuthor, MessageDTO>("/messages", messageDTO);
}

export async function updateMessage(id: string, updateDTO: UpdateMessageDTO) {
  return apiClient.patch<MessageWithAuthor, UpdateMessageDTO>(
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
