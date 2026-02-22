"use client"

import { Zap, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MenuScreenProps {
  onStart: () => void
  highScore: number
}

export function MenuScreen({ onStart, highScore }: MenuScreenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      {/* Glow effect behind logo */}
      <div className="relative">
        <div className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-2">
          <Zap className="h-16 w-16 text-primary" strokeWidth={2.5} />
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Fast Block
          </h1>
          <p className="text-muted-foreground text-center max-w-xs leading-relaxed">
            Place blocks on the 9x9 grid before time runs out. Clear rows and columns to score!
          </p>
        </div>
      </div>

      {/* High score */}
      {highScore > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
          <span className="text-sm text-accent font-medium">Best Score</span>
          <span className="font-mono text-lg font-bold text-accent">
            {highScore.toLocaleString()}
          </span>
        </div>
      )}

      {/* Rules */}
      <div className="grid max-w-sm gap-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            1
          </span>
          <span className="leading-relaxed">Select a block shape and tap the grid to place it</span>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            2
          </span>
          <span className="leading-relaxed">Place all 3 blocks within 30 seconds or lose a heart</span>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            3
          </span>
          <span className="leading-relaxed">Complete full rows or columns to blast them and earn bonus points</span>
        </div>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="w-full max-w-xs gap-2 bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 shadow-lg shadow-primary/25"
      >
        <Zap className="h-5 w-5" />
        Start Game
      </Button>
    </div>
  )
}

interface GameOverScreenProps {
  score: number
  highScore: number
  onRestart: () => void
  onMenu: () => void
}

export function GameOverScreen({
  score,
  highScore,
  onRestart,
  onMenu,
}: GameOverScreenProps) {
  const isNewHighScore = score >= highScore && score > 0

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="relative">
        <div className="absolute -inset-8 rounded-full bg-destructive/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-3">
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl">Game Over</h2>
          {isNewHighScore && (
            <div className="rounded-full bg-accent/20 border border-accent/40 px-4 py-1">
              <span className="text-sm font-bold text-accent">New High Score!</span>
            </div>
          )}
        </div>
      </div>

      {/* Score display */}
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 w-full max-w-xs">
        <span className="text-sm text-muted-foreground uppercase tracking-wider">Final Score</span>
        <span className="font-mono text-5xl font-bold text-foreground">
          {score.toLocaleString()}
        </span>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Best:</span>
          <span className="font-mono font-semibold text-accent">
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          onClick={onRestart}
          size="lg"
          className="w-full gap-2 bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 shadow-lg shadow-primary/25"
        >
          <RotateCcw className="h-5 w-5" />
          Play Again
        </Button>
        <Button
          onClick={onMenu}
          variant="outline"
          size="lg"
          className="w-full text-foreground border-border hover:bg-secondary"
        >
          Main Menu
        </Button>
      </div>
    </div>
  )
}
