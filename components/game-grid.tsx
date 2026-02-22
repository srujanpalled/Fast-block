"use client"

import { type CellState, GRID_SIZE } from "@/lib/game-types"
import type { BlockShape } from "@/lib/game-types"

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
    if (!canPlaceBlock(selectedBlock, hoverPosition.row, hoverPosition.col, grid)) return ghostSet

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
      {/* Outer glow */}
      <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md" />

      <div
        className="relative grid gap-[2px] rounded-xl border-2 border-border bg-secondary p-1.5"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`
            const isBlasting =
              blastingRows.includes(rowIdx) || blastingCols.includes(colIdx)
            const isGhost = ghostCells.has(key)

            // Section markers for 3x3 grid
            const isRightBorder = (colIdx + 1) % 3 === 0 && colIdx < GRID_SIZE - 1
            const isBottomBorder = (rowIdx + 1) % 3 === 0 && rowIdx < GRID_SIZE - 1

            return (
              <div
                key={key}
                onClick={() => onCellClick(rowIdx, colIdx)}
                onMouseEnter={() => onCellHover(rowIdx, colIdx)}
                onDragOver={(e) => {
                  e.preventDefault()
                  onDragOver(rowIdx, colIdx, e)
                }}
                onDrop={(e) => onDrop(rowIdx, colIdx, e)}
                className={`
                  relative aspect-square w-7 cursor-pointer rounded-sm transition-all duration-150 sm:w-8 md:w-9
                  ${cell.filled && !isBlasting ? "shadow-inner" : ""}
                  ${isBlasting ? "animate-pulse scale-110" : ""}
                  ${!cell.filled && !isGhost ? "bg-muted hover:bg-muted/80" : ""}
                  ${isGhost ? "ring-2 ring-primary/60 scale-105" : ""}
                  ${isRightBorder ? "mr-[1px]" : ""}
                  ${isBottomBorder ? "mb-[1px]" : ""}
                `}
                style={{
                  backgroundColor: cell.filled
                    ? isBlasting
                      ? "#ffffff"
                      : cell.color
                    : isGhost && selectedBlock
                      ? `${selectedBlock.color}66`
                      : undefined,
                  boxShadow: cell.filled && !isBlasting
                    ? `inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)`
                    : isBlasting
                      ? `0 0 12px 4px rgba(255,255,255,0.6)`
                      : undefined,
                }}
              >
                {/* Inner highlight for filled cells */}
                {cell.filled && !isBlasting && (
                  <div className="absolute inset-[2px] rounded-sm bg-gradient-to-b from-white/20 to-transparent" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
