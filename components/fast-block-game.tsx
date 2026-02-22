"use client"

import { useCallback } from "react"
import { useGameLogic } from "@/hooks/use-game-logic"
import { GameGrid } from "@/components/game-grid"
import { BlockOptions } from "@/components/block-options"
import { GameHeader } from "@/components/game-header"
import { MenuScreen, GameOverScreen } from "@/components/game-screens"

export function FastBlockGame() {
  const {
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
    canPlaceBlock,
    setGameState,
  } = useGameLogic()

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (selectedBlock === null) return
      placeBlock(selectedBlock, row, col)
    },
    [selectedBlock, placeBlock]
  )

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (selectedBlock === null) return
      setHoverPosition({ row, col })
    },
    [selectedBlock, setHoverPosition]
  )

  const handleGridLeave = useCallback(() => {
    setHoverPosition(null)
  }, [setHoverPosition])

  const handleDragStart = useCallback(
    (index: number, e: React.DragEvent) => {
      setSelectedBlock(index)
      e.dataTransfer.setData("blockIndex", index.toString())
      e.dataTransfer.effectAllowed = "move"
    },
    [setSelectedBlock]
  )

  const handleDragEnd = useCallback(() => {
    setSelectedBlock(null)
    setHoverPosition(null)
  }, [setSelectedBlock, setHoverPosition])

  const handleDrop = useCallback(
    (row: number, col: number, e: React.DragEvent) => {
      e.preventDefault()
      const indexStr = e.dataTransfer.getData("blockIndex")
      if (indexStr) {
        const index = parseInt(indexStr, 10)
        placeBlock(index, row, col)
      } else if (selectedBlock !== null) {
        placeBlock(selectedBlock, row, col)
      }
      setSelectedBlock(null)
      setHoverPosition(null)
    },
    [placeBlock, selectedBlock, setSelectedBlock, setHoverPosition]
  )

  const handleDragOver = useCallback(
    (row: number, col: number, e: React.DragEvent) => {
      e.preventDefault() // Necessary to allow dropping
      e.dataTransfer.dropEffect = "move"
      if (selectedBlock !== null) {
        setHoverPosition({ row, col })
      }
    },
    [selectedBlock, setHoverPosition]
  )

  if (gameState === "menu") {
    return <MenuScreen onStart={startGame} highScore={highScore} />
  }

  if (gameState === "gameover") {
    return (
      <GameOverScreen
        score={score}
        highScore={highScore}
        onRestart={startGame}
        onMenu={() => setGameState("menu")}
      />
    )
  }

  const currentSelectedBlock =
    selectedBlock !== null ? blockOptions[selectedBlock] : null

  return (
    <div className="flex min-h-svh flex-col items-center justify-between gap-4 p-4 pb-6 sm:justify-center sm:gap-6">
      {/* Header */}
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-center gap-2">
          <h1 className="text-lg font-bold text-foreground tracking-tight">Fast Block</h1>
        </div>
        <GameHeader score={score} hearts={hearts} highScore={highScore} />
      </div>

      {/* Grid */}
      <GameGrid
        grid={grid}
        blastingRows={blastingRows}
        blastingCols={blastingCols}
        selectedBlock={currentSelectedBlock}
        hoverPosition={hoverPosition}
        canPlaceBlock={canPlaceBlock}
        onCellClick={handleCellClick}
        onCellHover={handleCellHover}
        onGridLeave={handleGridLeave}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />

      {/* Block options with timer */}
      <div className="w-full max-w-md">
        <p className="mb-2 text-center text-xs text-muted-foreground">
          Drag a block to the grid to place it
        </p>
        <BlockOptions
          blocks={blockOptions}
          selectedIndex={selectedBlock}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  )
}
