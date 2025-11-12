import { VoteType } from "@/generated/prisma";

const API_URL = "/api/votes";

class VoteService {
  async vote(conversationId: string, type: VoteType): Promise<void> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversationId, type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors du vote");
    }
  }

  async removeVote(conversationId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${conversationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la suppression du vote");
    }
  }
}

const voteService = new VoteService();
export default voteService;

