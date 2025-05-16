"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import ExcuseCard from "@/components/ExcuseCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Excuse } from "@/types";
import { apiClient } from "@/lib/api";

export default function ExcusesPage() {
  const [filter, setFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(["all"]);

  const [data, setData] = useState<Excuse[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    apiClient
      .get("/api/excuses")
      .then((res) => {
        if (isMounted) {
          setData(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dummy mutate function for compatibility
  const mutate = () => {
    setIsLoading(true);
    apiClient
      .get("/api/excuses")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  // Safely handle excuses data
  const excuses = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Update categories when excuses change
  useEffect(() => {
    if (Array.isArray(excuses) && excuses.length > 0) {
      const uniqueCategories = [
        "all",
        ...new Set(excuses.map((excuse) => excuse.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [excuses]);

  // Filter excuses based on selected category
  const filteredExcuses =
    filter !== "all"
      ? excuses.filter((excuse) => excuse.category === filter)
      : excuses;

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-red-500">
          Failed to load excuses. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold fun-text mb-4">Browse Excuses</h1>
        <p className="text-muted-foreground">
          Find the perfect excuse for any situation
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === category
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExcuses.length > 0 ? (
            filteredExcuses.map((excuse) => (
              <ExcuseCard
                key={excuse.id}
                excuse={excuse}
                onVoteSuccess={() => mutate()}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No excuses found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
