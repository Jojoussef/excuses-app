"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Excuse } from "@/types";

export default function HomePage() {
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateExcuse = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/generate");
      setExcuse(response.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to cast vote. Please try again." + error.message);
      } else {
        toast.error("Failed to cast vote. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] gradient-bg flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          Excuses Machine <span className="text-yellow-300">2000</span>
        </h1>
        <p className="text-xl text-white/80">
          Need an excuse? We&apos;ve got you covered!
        </p>
      </div>

      <div className="w-full max-w-md">
        <Button
          size="lg"
          className="w-full text-lg py-6 bg-white text-purple-600 hover:bg-white/90 font-bold"
          onClick={generateExcuse}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Generate Excuse!"}
        </Button>

        {excuse && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="border-4 border-white/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <p className="text-xl text-white font-medium">{excuse.text}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-white/70">
                    Category: {excuse.category}
                  </span>
                  <span className="text-sm text-white/70">
                    Score: {excuse.score}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
