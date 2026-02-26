"use client"

import { Heart, Pause, Play, RotateCcw, Home } from "lucide-react"
import { MAX_HEARTS } from "@/lib/game-types"
import { Button } from "@/components/ui/button"

interface GameHeaderProps {
  score: number
  hearts: number
  highScore: number
  onPause?: () => void
  onRestart?: () => void
  onHome?: () => void
  isPaused?: boolean
}

export function GameHeader({ score, hearts, highScore, onPause, onRestart, onHome, isPaused }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Hearts Pill */}
      <div className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)]">
        {Array.from({ length: MAX_HEARTS }).map((_, i) => (
          <Heart
            key={i}
            className={`h-5 w-5 transition-all duration-300 ${i < hearts
              ? "fill-destructive text-destructive scale-100 drop-shadow-[0_0_8px_rgba(var(--destructive),0.6)]"
              : "fill-muted text-muted scale-90"
              } ${i < hearts ? "animate-[heartbeat_0.6s_ease-in-out]" : ""}`}
            strokeWidth={i < hearts ? 1.5 : 2}
          />
        ))}
      </div>

      {/* Central Stats Pill */}
      <div className="flex items-center gap-6 px-6 py-2 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center leading-tight">
          <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-semibold">Score</span>
          <span className="font-mono text-xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-sm tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        <div className="w-px h-8 bg-white/10" />

        <div className="flex flex-col items-center leading-tight">
          <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-semibold">Best</span>
          <span className="font-mono text-lg font-bold text-accent drop-shadow-[0_0_8px_rgba(var(--accent),0.5)] tabular-nums">
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Controls Pill */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)]">
        {onHome && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="h-9 w-9 rounded-full hover:bg-white/10 hover:text-white transition-colors border-none text-foreground/70"
            title="Main Menu"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Main Menu</span>
          </Button>
        )}
        {onPause && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPause}
            className="h-9 w-9 rounded-full hover:bg-white/10 hover:text-white transition-colors border-none text-foreground/70"
            title={isPaused ? "Resume Game" : "Pause Game"}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span className="sr-only">{isPaused ? "Resume Game" : "Pause Game"}</span>
          </Button>
        )}
        {onRestart && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRestart}
            className="h-9 w-9 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors border-none text-foreground/70"
            title="Restart Game"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Restart</span>
          </Button>
        )}
      </div>
    </div>
  )
}
