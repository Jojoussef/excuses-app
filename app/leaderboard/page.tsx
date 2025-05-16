"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExcuseCard from "@/components/ExcuseCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Excuse } from "@/types";
import { Trophy } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"week" | "all">("week");

  const [data, setData] = useState<Excuse[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(
        `/api/leaderboard?timeframe=${timeframe}`
      );
      setData(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const mutate = () => {
    fetchLeaderboard();
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  // Safely handle excuses data
  const excuses = Array.isArray(data) ? data : [];

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-red-500">
          Failed to load leaderboard. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold fun-text mb-4">Excuse Leaderboard</h1>
        <p className="text-muted-foreground">
          The most popular excuses of all time
        </p>
      </div>

      <Tabs
        defaultValue="week"
        className="w-full max-w-4xl mx-auto"
        onValueChange={(value) => setTimeframe(value as "week" | "all")}
      >
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="week" className="mt-0">
          {renderLeaderboard(excuses, isLoading, mutate)}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          {renderLeaderboard(excuses, isLoading, mutate)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderLeaderboard(
  excuses: Excuse[],
  isLoading: boolean,
  mutate: () => void
) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!excuses || excuses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No excuses found for this timeframe.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {excuses.map((excuse, index) => (
        <div key={excuse.id} className="relative">
          {index < 3 && (
            <div className="absolute -left-4 -top-4 z-10">
              <Trophy
                className={`h-8 w-8 ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : "text-amber-700"
                }`}
              />
            </div>
          )}
          <ExcuseCard
            excuse={excuse}
            onVoteSuccess={() => mutate()}
            isLeaderboard
            rank={index + 1}
          />
        </div>
      ))}
    </div>
  );
}
