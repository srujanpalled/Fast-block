"use client"

import { Play, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PauseOverlayProps {
    onResume: () => void
    onRestart: () => void
    onHome: () => void
}

export function PauseOverlay({ onResume, onRestart, onHome }: PauseOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/40"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex flex-col items-center gap-8 rounded-3xl border border-white/20 bg-white/10 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl w-[90%] max-w-sm"
            >
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm uppercase">
                        Paused
                    </h2>
                    <div className="h-1 w-12 rounded-full bg-primary/50" />
                </div>

                <div className="flex w-full flex-col gap-4">
                    <Button
                        onClick={onResume}
                        size="lg"
                        className="w-full h-14 rounded-xl gap-2 bg-white text-black text-lg font-bold hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all"
                    >
                        <Play className="h-5 w-5 fill-black" />
                        Resume
                    </Button>
                    <Button
                        onClick={onRestart}
                        variant="outline"
                        size="lg"
                        className="w-full h-14 rounded-xl gap-2 text-white border-white/20 bg-white/5 hover:bg-destructive/20 hover:text-white hover:border-destructive/30 transition-all"
                    >
                        <RotateCcw className="h-5 w-5" />
                        Restart
                    </Button>
                    <Button
                        onClick={onHome}
                        variant="outline"
                        size="lg"
                        className="w-full h-14 rounded-xl gap-2 text-white border-white/20 bg-white/5 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-sm"
                    >
                        <Home className="h-5 w-5" />
                        Main Menu
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    )
}
