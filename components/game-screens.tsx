"use client"

import { Zap, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface MenuScreenProps {
  onStart: () => void
  highScore: number
}

export function MenuScreen({ onStart, highScore }: MenuScreenProps) {
  return (
    <motion.div
      key="menu"
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-svh flex-col items-center justify-center gap-10 p-6 relative z-50"
    >
      {/* Glow effect behind logo */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-20 rounded-full bg-primary/20 blur-[60px] pointer-events-none"
        />
        <div className="relative flex flex-col items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            className="p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <Zap className="h-20 w-20 text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] fill-white/20" strokeWidth={1.5} />
          </motion.div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-7xl font-sans font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]">
              FAST BLOCK
            </h1>
            <p className="text-white/60 text-center max-w-xs leading-relaxed text-sm uppercase tracking-[0.2em] font-medium">
              A high-velocity grid challenge
            </p>
          </div>
        </div>
      </div>

      {/* High score */}
      {highScore > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-1 rounded-[1.5rem] border border-white/10 bg-black/40 backdrop-blur-xl px-12 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        >
          <span className="text-[10px] text-white/50 tracking-[0.3em] font-semibold uppercase">Personal Best</span>
          <span className="font-mono text-3xl font-bold text-accent drop-shadow-[0_0_15px_rgba(var(--accent),0.6)]">
            {highScore.toLocaleString()}
          </span>
        </motion.div>
      )}

      {/* Play Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-xs mt-4"
      >
        <Button
          onClick={onStart}
          size="lg"
          className="relative w-full h-16 rounded-2xl gap-3 bg-white text-black text-xl font-bold hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all overflow-hidden group"
        >
          {/* Subtle button sweep effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[sweep_1s_ease-in-out_infinite]" />
          <Zap className="h-6 w-6 fill-black" />
          START ENGINE
        </Button>
      </motion.div>
    </motion.div>
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
    <motion.div
      key="gameover"
      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-svh flex-col items-center justify-center gap-10 p-6 relative z-50"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-24 rounded-full bg-destructive/20 blur-[60px] pointer-events-none"
        />
        <div className="relative flex flex-col items-center gap-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-7xl font-sans font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]">
              GAME OVER
            </h2>
          </motion.div>

          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              className="rounded-[1rem] bg-gradient-to-r from-accent/20 to-primary/20 border border-white/20 px-6 py-2 backdrop-blur-xl shadow-[0_0_30px_rgba(var(--accent),0.3)] mt-2"
            >
              <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">New High Score 🏆</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Score display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-2 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-[30px] p-10 w-full max-w-sm shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

        <span className="text-xs text-white/50 uppercase tracking-[0.3em] font-semibold">Final Score</span>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="font-mono text-8xl font-black bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mt-2"
        >
          {score.toLocaleString()}
        </motion.span>

        <div className="mt-8 flex items-center justify-between w-full pt-6 border-t border-white/10 text-sm">
          <span className="text-white/50 font-semibold uppercase tracking-[0.2em]">Best</span>
          <span className="font-mono font-bold text-white/90 text-xl tracking-wider">
            {highScore.toLocaleString()}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <Button
          onClick={onRestart}
          size="lg"
          className="w-full h-16 rounded-2xl gap-3 bg-white text-black text-xl font-bold hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all"
        >
          <RotateCcw className="h-6 w-6" />
          PLAY AGAIN
        </Button>
        <Button
          onClick={onMenu}
          variant="outline"
          size="lg"
          className="w-full h-16 rounded-2xl text-white/70 hover:text-white font-bold tracking-widest border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-white/10 transition-all uppercase"
        >
          MAIN MENU
        </Button>
      </motion.div>
    </motion.div>
  )
}
