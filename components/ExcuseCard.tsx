"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import VoteButtons from "@/components/VoteButtons"
import type { Excuse } from "@/types"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type ExcuseCardProps = {
  excuse: Excuse
  onVoteSuccess: () => void
  isLeaderboard?: boolean
  rank?: number
}

export default function ExcuseCard({ excuse, onVoteSuccess, isLeaderboard = false, rank }: ExcuseCardProps) {
  const [isVoting, setIsVoting] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={cn(
          "h-full overflow-hidden transition-all hover:shadow-md",
          isLeaderboard && "border-2",
          rank === 1 && "border-yellow-500",
          rank === 2 && "border-gray-400",
          rank === 3 && "border-amber-700",
        )}
      >
        <CardContent className="p-6">
          {isLeaderboard && rank && (
            <div className="absolute top-3 right-3">
              <Badge variant={rank <= 3 ? "default" : "secondary"}>#{rank}</Badge>
            </div>
          )}

          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {excuse.category}
            </Badge>
            <p className="text-lg font-medium">{excuse.text}</p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <VoteButtons
            excuseId={excuse.id}
            score={excuse.score}
            onVoteSuccess={onVoteSuccess}
            setIsVoting={setIsVoting}
            isVoting={isVoting}
          />

          <span className="text-sm text-muted-foreground">{formatDate(excuse.createdAt)}</span>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}
