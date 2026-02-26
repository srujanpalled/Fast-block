"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  type CellState,
  type BlockShape,
  type GameState,
  GRID_SIZE,
  TIMER_DURATION,
  MAX_HEARTS,
  BLOCK_COLORS,
  BLOCK_TEMPLATES,
} from "@/lib/game-types"

function createEmptyGrid(): CellState[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ filled: false, color: "" }))
  )
}

function generateRandomBlock(): BlockShape {
  const template = BLOCK_TEMPLATES[Math.floor(Math.random() * BLOCK_TEMPLATES.length)]
  const color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)]
  return {
    cells: template,
    color,
    id: Math.random().toString(36).substring(2, 9),
  }
}

function generateBlockOptions(): BlockShape[] {
  const options = [generateRandomBlock(), generateRandomBlock(), generateRandomBlock()]
  return options.sort((a, b) => {
    const aCount = a.cells.flat().filter(Boolean).length
    const bCount = b.cells.flat().filter(Boolean).length
    return bCount - aCount
  })
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [grid, setGrid] = useState<CellState[][]>(createEmptyGrid)
  const [blockOptions, setBlockOptions] = useState<BlockShape[]>([])
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [blastingRows, setBlastingRows] = useState<number[]>([])
  const [blastingCols, setBlastingCols] = useState<number[]>([])
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{
    row: number
    col: number
  } | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const checkAndClearLines = useCallback(
    (currentGrid: CellState[][]): { newGrid: CellState[][]; linesCleared: number } => {
      const rowsToClear: number[] = []
      const colsToClear: number[] = []

      // Check rows
      for (let r = 0; r < GRID_SIZE; r++) {
        if (currentGrid[r].every((cell) => cell.filled)) {
          rowsToClear.push(r)
        }
      }

      // Check columns
      for (let c = 0; c < GRID_SIZE; c++) {
        let full = true
        for (let r = 0; r < GRID_SIZE; r++) {
          if (!currentGrid[r][c].filled) {
            full = false
            break
          }
        }
        if (full) colsToClear.push(c)
      }

      const totalLines = rowsToClear.length + colsToClear.length
      if (totalLines === 0) return { newGrid: currentGrid, linesCleared: 0 }

      // Show blast animation
      setBlastingRows(rowsToClear)
      setBlastingCols(colsToClear)

      const newGrid = currentGrid.map((row) => row.map((cell) => ({ ...cell })))

      for (const r of rowsToClear) {
        for (let c = 0; c < GRID_SIZE; c++) {
          newGrid[r][c] = { filled: false, color: "" }
        }
      }
      for (const c of colsToClear) {
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r][c] = { filled: false, color: "" }
        }
      }

      // Clear the blast animation after a delay
      setTimeout(() => {
        setBlastingRows([])
        setBlastingCols([])
      }, 400)

      return { newGrid, linesCleared: totalLines }
    },
    []
  )

  const canPlaceBlock = useCallback(
    (block: BlockShape, row: number, col: number, currentGrid: CellState[][]): boolean => {
      for (let r = 0; r < block.cells.length; r++) {
        for (let c = 0; c < block.cells[r].length; c++) {
          if (block.cells[r][c]) {
            const gr = row + r
            const gc = col + c
            if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) return false
            if (currentGrid[gr][gc].filled) return false
          }
        }
      }
      return true
    },
    []
  )

  const canPlaceAnyBlock = useCallback(
    (blocks: BlockShape[], currentGrid: CellState[][]): boolean => {
      for (const block of blocks) {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (canPlaceBlock(block, r, c, currentGrid)) return true
          }
        }
      }
      return false
    },
    [canPlaceBlock]
  )

  const startTimer = useCallback(() => {
    clearTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === "playing") {
        clearTimer()
        return "paused"
      }
      if (prev === "paused") {
        startTimer()
        return "playing"
      }
      return prev
    })
  }, [clearTimer, startTimer])

  const generatePlayableOptions = useCallback(
    (currentGrid: CellState[][]) => {
      let freshOptions = generateBlockOptions()
      let attempts = 0
      while (!canPlaceAnyBlock(freshOptions, currentGrid) && attempts < 50) {
        freshOptions = generateBlockOptions()
        attempts++
      }

      if (!canPlaceAnyBlock(freshOptions, currentGrid)) {
        // Fallback to minimal 1x1 block if somehow 50 attempts fail
        freshOptions = [{
          id: Math.random().toString(36).substring(2, 9),
          color: BLOCK_COLORS[0],
          cells: [[true]]
        }]
      }
      return freshOptions
    },
    [canPlaceAnyBlock]
  )

  // Handle time expiry
  useEffect(() => {
    if (timeLeft === 0 && gameState === "playing") {
      clearTimer()
      if (hearts <= 1) {
        setHearts(0)
        setGameState("gameover")
      } else {
        setHearts((prev) => prev - 1)
        setBlockOptions(generatePlayableOptions(grid))
        setTimeLeft(TIMER_DURATION)
        startTimer()
      }
    }
  }, [timeLeft, gameState, clearTimer, startTimer, hearts, grid, generatePlayableOptions])

  const placeBlock = useCallback(
    (blockIndex: number, row: number, col: number) => {
      const block = blockOptions[blockIndex]
      if (!block) return false

      setGrid((currentGrid) => {
        if (!canPlaceBlock(block, row, col, currentGrid)) return currentGrid

        const newGrid = currentGrid.map((r) => r.map((c) => ({ ...c })))
        for (let r = 0; r < block.cells.length; r++) {
          for (let c = 0; c < block.cells[r].length; c++) {
            if (block.cells[r][c]) {
              newGrid[row + r][col + c] = { filled: true, color: block.color }
            }
          }
        }

        // Remove placed block from options
        const newOptions = blockOptions.map((b, i) => (i === blockIndex ? null : b)).filter(Boolean) as BlockShape[]

        // Check lines
        const { newGrid: clearedGrid, linesCleared } = checkAndClearLines(newGrid)

        // Update score
        const blockCells = block.cells.flat().filter(Boolean).length
        const lineBonus = linesCleared * linesCleared * 100
        const placementScore = blockCells * 10
        setScore((prev) => prev + placementScore + lineBonus)

        // Check if all options placed
        if (newOptions.length === 0) {
          const freshOptions = generatePlayableOptions(clearedGrid)
          setBlockOptions(freshOptions)
          setTimeLeft(TIMER_DURATION)
          startTimer()
        } else if (!canPlaceAnyBlock(newOptions, clearedGrid)) {
          // If remaining blocks can't be placed, give new playable options naturally
          const freshOptions = generatePlayableOptions(clearedGrid)
          setBlockOptions(freshOptions)
          setTimeLeft(TIMER_DURATION)
          startTimer()
        } else {
          setBlockOptions(newOptions)
        }

        setSelectedBlock(null)
        setHoverPosition(null)
        return clearedGrid
      })

      return true
    },
    [blockOptions, canPlaceBlock, checkAndClearLines, startTimer, canPlaceAnyBlock, generatePlayableOptions]
  )

  const startGame = useCallback(() => {
    const newGrid = createEmptyGrid()
    const newOptions = generatePlayableOptions(newGrid)
    setGrid(newGrid)
    setBlockOptions(newOptions)
    setHearts(MAX_HEARTS)
    setScore(0)
    setTimeLeft(TIMER_DURATION)
    setSelectedBlock(null)
    setHoverPosition(null)
    setBlastingRows([])
    setBlastingCols([])
    setGameState("playing")
    startTimer()
  }, [startTimer, generatePlayableOptions])

  const endGame = useCallback(() => {
    clearTimer()
    setHighScore((prev) => Math.max(prev, score))
    setGameState("gameover")
  }, [clearTimer, score])

  // Save high score on game over
  useEffect(() => {
    if (gameState === "gameover") {
      setHighScore((prev) => Math.max(prev, score))
    }
  }, [gameState, score])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    gameState,
    grid,
    blockOptions,
    hearts,
    score,
    highScore,
    timeLeft,
    blastingRows,
    blastingCols,
    selectedBlock,
    hoverPosition,
    setSelectedBlock,
    setHoverPosition,
    placeBlock,
    startGame,
    endGame,
    canPlaceBlock,
    setGameState,
    togglePause,
  }
}
