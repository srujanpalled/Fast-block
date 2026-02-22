export type CellState = {
  filled: boolean
  color: string
}

export type BlockShape = {
  cells: boolean[][]
  color: string
  id: string
}

export type GameState = "menu" | "playing" | "gameover"

export const GRID_SIZE = 9
export const TIMER_DURATION = 30
export const MAX_HEARTS = 3

export const BLOCK_COLORS = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#8b5cf6", // violet (only on blocks, not the theme)
  "#06b6d4", // cyan
  "#f97316", // orange
]

export const BLOCK_TEMPLATES: boolean[][][] = [
  // 1x1
  [[true]],
  // 2x1 horizontal
  [[true, true]],
  // 1x2 vertical
  [[true], [true]],
  // 3x1 horizontal
  [[true, true, true]],
  // 1x3 vertical
  [[true], [true], [true]],
  // 2x2 square
  [
    [true, true],
    [true, true],
  ],
  // 3x3 square
  [
    [true, true, true],
    [true, true, true],
    [true, true, true],
  ],
  // L shape
  [
    [true, false],
    [true, false],
    [true, true],
  ],
  // Reverse L
  [
    [false, true],
    [false, true],
    [true, true],
  ],
  // T shape
  [
    [true, true, true],
    [false, true, false],
  ],
  // S shape
  [
    [false, true, true],
    [true, true, false],
  ],
  // Z shape
  [
    [true, true, false],
    [false, true, true],
  ],
  // 4x1 horizontal
  [[true, true, true, true]],
  // 1x4 vertical
  [[true], [true], [true], [true]],
  // 2x3
  [
    [true, true, true],
    [true, true, true],
  ],
  // 3x2
  [
    [true, true],
    [true, true],
    [true, true],
  ],
]
