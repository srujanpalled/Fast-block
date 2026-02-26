"use client"

import type { BlockShape } from "@/lib/game-types"
import { TIMER_DURATION } from "@/lib/game-types"
import { motion, AnimatePresence } from "framer-motion"

interface BlockOptionsProps {
  blocks: BlockShape[]
  selectedIndex: number | null
  onDragStart: (index: number, e: React.DragEvent) => void
  onDragEnd: () => void
  onClick: (index: number) => void
  timeLeft: number
}

export function BlockOptions({
  blocks,
  selectedIndex,
  onDragStart,
  onDragEnd,
  onClick,
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
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]"
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
            stroke="rgba(255,255,255,0.05)"
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
              filter: `drop-shadow(0 0 8px ${timerColor}80)`,
            }}
          />
        </svg>
      </div>

      {/* Timer text */}
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <span
          className="font-mono text-3xl font-extrabold tabular-nums transition-colors duration-300 drop-shadow-md"
          style={{ color: timerColor }}
        >
          {timeLeft}
        </span>
        <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1">sec</span>
      </div>

      {/* Block options */}
      <div className="flex min-h-[100px] items-center justify-center gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => {
            const isSelected = selectedIndex === index;

            return (
              <motion.button
                layout
                key={block.id}
                initial={{ scale: 0.5, y: 20, opacity: 0 }}
                animate={{
                  scale: isSelected ? 0.95 : 1,
                  y: isSelected ? 2 : 0,
                  opacity: isSelected ? 0.4 : 1 // Keep it visible but subtle
                }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.15 } }}
                whileHover={{
                  scale: isSelected ? 0.95 : 1.1,
                  y: isSelected ? 2 : -4,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                draggable
                onClick={() => onClick(index)}
                onDragStart={(e: any) => {
                  // Hide the default browser drag image so we can use smooth dragging
                  const img = new Image()
                  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                  if (e.dataTransfer) e.dataTransfer.setDragImage(img, 0, 0)
                  onDragStart(index, e)
                }}
                onDragEnd={onDragEnd}
                className={`
                  relative flex flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-300
                  ${isSelected
                    ? "border-primary/50 bg-primary/10 shadow-[inset_0_0_20px_rgba(var(--primary),0.2),0_0_20px_rgba(var(--primary),0.3)] cursor-grabbing"
                    : "border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-white/20 hover:bg-white/5 cursor-grab active:cursor-grabbing"
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
                        className="relative h-4 w-4 rounded-[4px] sm:h-[1.4rem] sm:w-[1.4rem] overflow-hidden"
                        style={{
                          backgroundColor: filled ? block.color : "transparent",
                          boxShadow: filled
                            ? `inset 0 0 10px rgba(0,0,0,0.5), inset 0 3px 6px rgba(255,255,255,0.5), 0 4px 10px ${block.color}40, 0 0 20px ${block.color}20`
                            : undefined,
                          border: filled ? "1px solid rgba(255,255,255,0.2)" : undefined
                        }}
                      >
                        {filled && (
                          <>
                            {/* Inner 3D crystal highlights */}
                            <div className="absolute inset-[1px] rounded-[3px] bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none" />
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -bottom-1 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),1)]" />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
