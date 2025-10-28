import { Message } from "@/generated/prisma";
import MessageButtonDelete from "./MessageButtonDelete";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div className="border shadow-sm rounded-md p-8 relative">
      <MessageButtonDelete className="absolute top-2 right-2" id={message.id} />
      {message.content}
    </div>
  );
}
