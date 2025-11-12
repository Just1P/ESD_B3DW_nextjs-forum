"use client";

import { VoteType } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import VoteService from "@/services/vote.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const voteMutation = useMutation({
    mutationFn: async (type: VoteType) => {
      await VoteService.vote(conversationId, type);
    },
    onMutate: async (type) => {
      const previousScore = voteScore;
      const previousVote = userVote;

      if (userVote === type) {
        setVoteScore(voteScore + (type === VoteType.UP ? -1 : 1));
        setUserVote(null);
      } else if (userVote) {
        setVoteScore(voteScore + (type === VoteType.UP ? 2 : -2));
        setUserVote(type);
      } else {
        setVoteScore(voteScore + (type === VoteType.UP ? 1 : -1));
        setUserVote(type);
      }

      return { previousScore, previousVote };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error, _type, context) => {
      if (context) {
        setVoteScore(context.previousScore);
        setUserVote(context.previousVote);
      }
      console.error("Erreur lors du vote:", error);
      toast.error("Erreur lors du vote");
    },
  });

  const handleVote = (type: VoteType) => {
    if (!session?.user) {
      toast.error("Vous devez être connecté pour voter");
      router.push("/signin");
      return;
    }
    voteMutation.mutate(type);
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
        disabled={voteMutation.isPending}
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
        disabled={voteMutation.isPending}
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
