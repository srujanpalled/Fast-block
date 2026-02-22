"use client"

import type { BlockShape } from "@/lib/game-types"
import { TIMER_DURATION } from "@/lib/game-types"

interface BlockOptionsProps {
  blocks: BlockShape[]
  selectedIndex: number | null
  onDragStart: (index: number, e: React.DragEvent) => void
  onDragEnd: () => void
  timeLeft: number
}

export function BlockOptions({
  blocks,
  selectedIndex,
  onDragStart,
  onDragEnd,
  timeLeft,
}: BlockOptionsProps) {
  const timerProgress = timeLeft / TIMER_DURATION
  const circumference = 2 * Math.PI * 58
  const offset = circumference * (1 - timerProgress)

  const timerColor =
    timeLeft > 20
      ? "var(--primary)"
      : timeLeft > 10
        ? "var(--accent)"
        : "var(--destructive)"

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Circular timer surrounding the options area */}
      <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 130 90"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Background track */}
          <rect
            x="2"
            y="2"
            width="126"
            height="86"
            rx="16"
            ry="16"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="3"
          />
          {/* Timer track */}
          <rect
            x="2"
            y="2"
            width="126"
            height="86"
            rx="16"
            ry="16"
            fill="none"
            stroke={timerColor}
            strokeWidth="3"
            strokeDasharray={`${(126 + 86) * 2}`}
            strokeDashoffset={`${(126 + 86) * 2 * (1 - timerProgress)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: timeLeft <= 10 ? `drop-shadow(0 0 6px ${timerColor})` : undefined,
            }}
          />
        </svg>
      </div>

      {/* Timer text */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <span
          className="font-mono text-2xl font-bold tabular-nums transition-colors duration-300"
          style={{ color: timerColor }}
        >
          {timeLeft}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">sec</span>
      </div>

      {/* Block options */}
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {blocks.map((block, index) => (
          <button
            key={block.id}
            draggable
            onDragStart={(e) => {
              // Hide the default browser drag image
              const img = new Image()
              img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
              e.dataTransfer.setDragImage(img, 0, 0)
              onDragStart(index, e)
            }}
            onDragEnd={onDragEnd}
            className={`
              relative flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all duration-200
              ${selectedIndex === index
                ? "scale-110 border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80 cursor-grab active:cursor-grabbing"
              }
            `}
          >
            {/* Block preview */}
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${block.cells[0].length}, 1fr)`,
              }}
            >
              {block.cells.map((row, r) =>
                row.map((filled, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="h-4 w-4 rounded-sm sm:h-5 sm:w-5"
                    style={{
                      backgroundColor: filled ? block.color : "transparent",
                      boxShadow: filled
                        ? `inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)`
                        : undefined,
                    }}
                  >
                    {filled && (
                      <div className="h-full w-full rounded-sm bg-gradient-to-b from-white/20 to-transparent" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Selection indicator */}
            {selectedIndex === index && (
              <div className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
