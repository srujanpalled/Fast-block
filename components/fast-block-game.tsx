"use client"

import { useCallback } from "react"
import { useGameLogic } from "@/hooks/use-game-logic"
import { GameGrid } from "@/components/game-grid"
import { BlockOptions } from "@/components/block-options"
import { GameHeader } from "@/components/game-header"
import { MenuScreen, GameOverScreen } from "@/components/game-screens"
import { PauseOverlay } from "@/components/pause-overlay"
import { AnimatePresence, motion } from "framer-motion"

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
    togglePause,
  } = useGameLogic()

  const handleBlockClick = useCallback((index: number) => {
    if (gameState === "paused") return
    setSelectedBlock(prev => prev === index ? null : index)
  }, [gameState, setSelectedBlock])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState === "paused" || selectedBlock === null) return
      const block = blockOptions[selectedBlock]
      if (!block) return
      const bHeight = block.cells.length
      const bWidth = block.cells[0].length
      placeBlock(selectedBlock, row - Math.floor(bHeight / 2), col - Math.floor(bWidth / 2))
    },
    [gameState, selectedBlock, placeBlock, blockOptions]
  )

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (gameState === "paused" || selectedBlock === null) return
      const block = blockOptions[selectedBlock]
      if (!block) return
      const bHeight = block.cells.length
      const bWidth = block.cells[0].length
      setHoverPosition({
        row: row - Math.floor(bHeight / 2),
        col: col - Math.floor(bWidth / 2)
      })
    },
    [gameState, selectedBlock, setHoverPosition, blockOptions]
  )

  const handleGridLeave = useCallback(() => {
    setHoverPosition(null)
  }, [setHoverPosition])

  const handleDragStart = useCallback(
    (index: number, e: React.DragEvent) => {
      if (gameState === "paused") {
        e.preventDefault()
        return
      }
      setSelectedBlock(index)
      e.dataTransfer.setData("blockIndex", index.toString())
      e.dataTransfer.effectAllowed = "move"
    },
    [gameState, setSelectedBlock]
  )

  const handleDragEnd = useCallback(() => {
    setSelectedBlock(null)
    setHoverPosition(null)
  }, [setSelectedBlock, setHoverPosition])

  const handleDrop = useCallback(
    (row: number, col: number, e: React.DragEvent) => {
      e.preventDefault()
      if (gameState === "paused") return
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
    [gameState, placeBlock, selectedBlock, setSelectedBlock, setHoverPosition]
  )

  const handleDragOver = useCallback(
    (row: number, col: number, e: React.DragEvent) => {
      e.preventDefault() // Necessary to allow dropping
      if (gameState === "paused") return
      e.dataTransfer.dropEffect = "move"
      if (selectedBlock !== null) {
        setHoverPosition({ row, col })
      }
    },
    [gameState, selectedBlock, setHoverPosition]
  )

  const currentSelectedBlock =
    selectedBlock !== null ? blockOptions[selectedBlock] : null

  return (
    <div className="min-h-svh bg-background overflow-hidden relative">
      <AnimatePresence mode="wait">
        {gameState === "menu" && (
          <MenuScreen key="menu" onStart={startGame} highScore={highScore} />
        )}

        {gameState === "gameover" && (
          <GameOverScreen
            key="gameover"
            score={score}
            highScore={highScore}
            onRestart={startGame}
            onMenu={() => setGameState("menu")}
          />
        )}

        {(gameState === "playing" || gameState === "paused") && (
          <motion.div
            key="playing-stage"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`flex min-h-svh flex-col items-center justify-between gap-4 p-4 pb-6 sm:justify-center sm:gap-6 relative z-10`}
          >
            {/* Ambient Background Glows for Playing Area */}
            <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-full max-w-md"
            >
              <div className="mb-2 flex items-center justify-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
                  Fast Block
                </h1>
              </div>
              <GameHeader
                score={score}
                hearts={hearts}
                highScore={highScore}
                onPause={togglePause}
                onRestart={startGame}
                onHome={() => setGameState("menu")}
                isPaused={gameState === "paused"}
              />
            </motion.div>

            {/* Grid */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
              className={`z-10 ${gameState === "paused" ? "pointer-events-none opacity-50 transition-opacity duration-300" : ""}`}
            >
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
            </motion.div>

            {/* Block options with timer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className={`w-full max-w-md z-10 ${gameState === "paused" ? "pointer-events-none opacity-50 transition-opacity duration-300" : ""}`}
            >
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-foreground/50">
                Drag or tap to place
              </p>
              <BlockOptions
                blocks={blockOptions}
                selectedIndex={selectedBlock}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={handleBlockClick}
                timeLeft={timeLeft}
              />
            </motion.div>

            {/* Pause Overlay */}
            <AnimatePresence>
              {gameState === "paused" && (
                <PauseOverlay
                  key="pause-overlay"
                  onResume={() => togglePause()}
                  onRestart={startGame}
                  onHome={() => setGameState("menu")}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
