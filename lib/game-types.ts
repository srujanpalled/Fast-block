export type CellState = {
  filled: boolean
  color: string
}

export type BlockShape = {
  cells: boolean[][]
  color: string
  id: string
}

export type GameState = "menu" | "playing" | "paused" | "gameover"

export const GRID_SIZE = 9
export const TIMER_DURATION = 30
export const MAX_HEARTS = 3

export const BLOCK_COLORS = [
  "#20e59b", // Mint Electric
  "#1d7afc", // Azure Core
  "#fbbb11", // Amber Flare
  "#ff355e", // Crimson Spark
  "#f72585", // Neon Magenta
  "#7b2cbf", // Deep Amethyst
  "#00f5d4", // Fluor Cyan
  "#ff7900", // Tangerine Burst
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
