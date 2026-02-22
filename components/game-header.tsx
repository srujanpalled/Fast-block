"use client"

import { Heart } from "lucide-react"
import { MAX_HEARTS } from "@/lib/game-types"

interface GameHeaderProps {
  score: number
  hearts: number
  highScore: number
}

export function GameHeader({ score, hearts, highScore }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Hearts */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: MAX_HEARTS }).map((_, i) => (
          <Heart
            key={i}
            className={`h-6 w-6 transition-all duration-300 ${
              i < hearts
                ? "fill-destructive text-destructive scale-100"
                : "fill-muted text-muted scale-90"
            } ${i < hearts ? "animate-[heartbeat_0.6s_ease-in-out]" : ""}`}
          />
        ))}
      </div>

      {/* Score */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
        <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
          {score.toLocaleString()}
        </span>
      </div>

      {/* High Score */}
      <div className="flex flex-col items-end">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Best</span>
        <span className="font-mono text-lg font-semibold text-accent tabular-nums">
          {highScore.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
