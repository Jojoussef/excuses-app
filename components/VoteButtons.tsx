"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

type VoteButtonsProps = {
  excuseId: string;
  score: number;
  onVoteSuccess: () => void;
  isVoting: boolean;
  setIsVoting: (isVoting: boolean) => void;
};

export default function VoteButtons({
  excuseId,
  score,
  onVoteSuccess,
  isVoting,
  setIsVoting,
}: VoteButtonsProps) {
  const [localScore, setLocalScore] = useState(score);

  const handleVote = async (direction: "up" | "down") => {
    try {
      setIsVoting(true);
      const response = await apiClient.post(`/api/excuses/${excuseId}/vote`, {
        direction,
      });
      setLocalScore(response.data.newScore);
      onVoteSuccess();
    } catch (error) {
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote("up")}
        disabled={isVoting}
        aria-label="Upvote"
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>

      {isVoting ? (
        <LoadingSpinner size="sm" />
      ) : (
        <span className="font-medium">{localScore}</span>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote("down")}
        disabled={isVoting}
        aria-label="Downvote"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
