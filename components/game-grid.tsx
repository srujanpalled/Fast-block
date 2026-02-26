"use client"

import { type CellState, GRID_SIZE } from "@/lib/game-types"
import type { BlockShape } from "@/lib/game-types"
import { motion, AnimatePresence } from "framer-motion"

interface GameGridProps {
  grid: CellState[][]
  blastingRows: number[]
  blastingCols: number[]
  selectedBlock: BlockShape | null
  hoverPosition: { row: number; col: number } | null
  canPlaceBlock: (block: BlockShape, row: number, col: number, grid: CellState[][]) => boolean
  onCellClick: (row: number, col: number) => void
  onCellHover: (row: number, col: number) => void
  onGridLeave: () => void
  onDrop: (row: number, col: number, e: React.DragEvent) => void
  onDragOver: (row: number, col: number, e: React.DragEvent) => void
}

export function GameGrid({
  grid,
  blastingRows,
  blastingCols,
  selectedBlock,
  hoverPosition,
  canPlaceBlock,
  onCellClick,
  onCellHover,
  onGridLeave,
  onDrop,
  onDragOver,
}: GameGridProps) {
  const getGhostCells = (): Set<string> => {
    const ghostSet = new Set<string>()
    if (!selectedBlock || !hoverPosition) return ghostSet

    if (!canPlaceBlock(selectedBlock, hoverPosition.row, hoverPosition.col, grid)) {
      return ghostSet
    }

    for (let r = 0; r < selectedBlock.cells.length; r++) {
      for (let c = 0; c < selectedBlock.cells[r].length; c++) {
        if (selectedBlock.cells[r][c]) {
          ghostSet.add(`${hoverPosition.row + r}-${hoverPosition.col + c}`)
        }
      }
    }
    return ghostSet
  }

  const ghostCells = getGhostCells()

  return (
    <div
      className="relative mx-auto"
      onMouseLeave={onGridLeave}
    >
      {/* Outer Deep Glow */}
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 blur-2xl pointer-events-none opacity-50" />

      <div
        className="relative grid gap-[3px] rounded-[1.25rem] border border-white/5 bg-black/40 backdrop-blur-[30px] p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!selectedBlock) return
          e.dataTransfer.dropEffect = "move"

          const rect = e.currentTarget.getBoundingClientRect()
          const padding = 10
          // Use Math.round to find the nearest cell center rather than floor
          // to prevent snapping back and forth rapidly between edges
          const x = Math.max(0, e.clientX - rect.left - padding)
          const y = Math.max(0, e.clientY - rect.top - padding)

          const cellWidth = (rect.width - (padding * 2) - (GRID_SIZE - 1) * 3) / GRID_SIZE
          const cellHeight = (rect.height - (padding * 2) - (GRID_SIZE - 1) * 3) / GRID_SIZE

          let colIdx = Math.round(x / (cellWidth + 3))
          let rowIdx = Math.round(y / (cellHeight + 3))

          colIdx = Math.max(0, Math.min(GRID_SIZE - 1, colIdx))
          rowIdx = Math.max(0, Math.min(GRID_SIZE - 1, rowIdx))

          const bWidth = selectedBlock.cells[0].length
          const bHeight = selectedBlock.cells.length
          colIdx -= Math.floor(bWidth / 2)
          rowIdx -= Math.floor(bHeight / 2)

          onDragOver(rowIdx, colIdx, e)
        }}
        onDrop={(e) => {
          e.preventDefault()
          if (!selectedBlock) return
          e.stopPropagation()
          const rect = e.currentTarget.getBoundingClientRect()
          const padding = 10
          const x = Math.max(0, e.clientX - rect.left - padding)
          const y = Math.max(0, e.clientY - rect.top - padding)

          const cellWidth = (rect.width - (padding * 2) - (GRID_SIZE - 1) * 3) / GRID_SIZE
          const cellHeight = (rect.height - (padding * 2) - (GRID_SIZE - 1) * 3) / GRID_SIZE

          let colIdx = Math.round(x / (cellWidth + 3))
          let rowIdx = Math.round(y / (cellHeight + 3))

          colIdx = Math.max(0, Math.min(GRID_SIZE - 1, colIdx))
          rowIdx = Math.max(0, Math.min(GRID_SIZE - 1, rowIdx))

          const bWidth = selectedBlock.cells[0].length
          const bHeight = selectedBlock.cells.length
          colIdx -= Math.floor(bWidth / 2)
          rowIdx -= Math.floor(bHeight / 2)

          onDrop(rowIdx, colIdx, e)
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`
            const isBlasting = blastingRows.includes(rowIdx) || blastingCols.includes(colIdx)
            const isGhost = ghostCells.has(key)

            // Distinct 3x3 markers
            const isRightBorder = (colIdx + 1) % 3 === 0 && colIdx < GRID_SIZE - 1
            const isBottomBorder = (rowIdx + 1) % 3 === 0 && rowIdx < GRID_SIZE - 1

            return (
              <div
                key={key}
                onClick={() => onCellClick(rowIdx, colIdx)}
                onMouseEnter={() => onCellHover(rowIdx, colIdx)}
                className={`
                  relative aspect-square w-[1.8rem] cursor-pointer rounded-[6px] sm:w-[2.2rem] md:w-[2.4rem] transition-all duration-300
                  ${!cell.filled && !isGhost ? "bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.08] hover:border-white/[0.1]" : ""}
                  ${isGhost ? "z-10 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)] border-2 border-white/50 backdrop-blur-sm" : ""}
                  ${isRightBorder ? "mr-[2px]" : ""}
                  ${isBottomBorder ? "mb-[2px]" : ""}
                `}
                style={{
                  backgroundColor: isGhost && selectedBlock ? `${selectedBlock.color}20` : undefined,
                }}
              >
                <AnimatePresence>
                  {cell.filled && (
                    <motion.div
                      layoutId={`cell-${key}`}
                      initial={{ scale: 0.1, rotate: -30, opacity: 0 }}
                      animate={{
                        scale: isBlasting ? 1.3 : 1,
                        rotate: 0,
                        opacity: isBlasting ? [1, 0] : 1
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="absolute inset-0 rounded-[6px] shadow-lg border border-white/20 overflow-hidden"
                      style={{
                        backgroundColor: isBlasting ? "#fff" : cell.color,
                        boxShadow: isBlasting
                          ? `0 0 30px 15px ${cell.color}80`
                          : `inset 0 0 10px rgba(0,0,0,0.5), inset 0 3px 6px rgba(255,255,255,0.5), 0 4px 10px ${cell.color}40, 0 0 20px ${cell.color}20`
                      }}
                    >
                      {/* Inner 3D crystal highlights */}
                      <div className="absolute inset-[1px] rounded-[4px] bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
