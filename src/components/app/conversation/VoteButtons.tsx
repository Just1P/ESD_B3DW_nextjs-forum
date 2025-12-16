"use client";

import { VoteType } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import VoteService from "@/services/vote.service";
import type { ConversationWithExtend } from "@/types/conversation.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface VoteButtonsProps {
  conversationId: string;
  initialVoteScore: number;
  initialUserVote: VoteType | null;
}

export default function VoteButtons({
  conversationId,
  initialVoteScore,
  initialUserVote,
}: VoteButtonsProps) {
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();

  const lastVoteRef = useRef<VoteType | null>(initialUserVote);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const voteMutation = useMutation({
    mutationFn: async (type: VoteType) => {
      await VoteService.vote(conversationId, type);
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement du vote");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleVote = (type: VoteType) => {
    if (!session?.user) {
      toast.error("Vous devez être connecté pour voter");
      router.push("/signin");
      return;
    }

    // Mise à jour optimiste immédiate de l'UI + cache liste
    let newScore = voteScore;
    let newVote: VoteType | null = userVote;

    if (userVote === type) {
      newScore = voteScore + (type === VoteType.UP ? -1 : 1);
      newVote = null;
    } else if (userVote) {
      newScore = voteScore + (type === VoteType.UP ? 2 : -2);
      newVote = type;
    } else {
      newScore = voteScore + (type === VoteType.UP ? 1 : -1);
      newVote = type;
    }

    setVoteScore(newScore);
    setUserVote(newVote);

    queryClient.setQueryData<ConversationWithExtend[]>(
      ["conversations"],
      (oldConversations) => {
        if (!oldConversations) return oldConversations;

        return oldConversations.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                voteScore: newScore,
                userVote: newVote,
              }
            : conversation
        );
      }
    );

    // Debounce des appels API : on n'envoie que le dernier état après un court délai
    lastVoteRef.current = newVote ?? type;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      const finalVote = lastVoteRef.current;
      if (finalVote) {
        voteMutation.mutate(finalVote);
      }
    }, 200);
  };

  return (
    <div className="bg-gray-50 w-12 flex flex-col items-center py-2 gap-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote(VoteType.UP);
        }}
        className="hover:bg-gray-200 rounded p-1 transition-colors cursor-pointer"
      >
        <ArrowBigUp
          className={`h-6 w-6 ${
            userVote === VoteType.UP
              ? "text-orange-500 fill-orange-500"
              : "text-gray-400 hover:text-orange-500"
          }`}
        />
      </button>
      <span
        className={`text-xs font-bold ${
          voteScore > 0
            ? "text-orange-500"
            : voteScore < 0
            ? "text-blue-500"
            : "text-gray-700"
        }`}
      >
        {voteScore}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote(VoteType.DOWN);
        }}
        className="hover:bg-gray-200 rounded p-1 transition-colors cursor-pointer"
      >
        <ArrowBigDown
          className={`h-6 w-6 ${
            userVote === VoteType.DOWN
              ? "text-blue-500 fill-blue-500"
              : "text-gray-400 hover:text-blue-500"
          }`}
        />
      </button>
    </div>
  );
}
