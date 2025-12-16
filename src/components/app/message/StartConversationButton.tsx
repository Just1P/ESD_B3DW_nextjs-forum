"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StartConversationButtonProps {
  recipientId: string;
  recipientName: string;
}

export default function StartConversationButton({
  recipientId,
  recipientName,
}: StartConversationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartConversation = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/private-conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientId }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la conversation");
      }

      const conversation = await response.json();
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de démarrer la conversation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartConversation}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
      {isLoading ? "Chargement..." : `Envoyer un message à ${recipientName}`}
    </button>
  );
}
