import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiCelebrationProps {
  active: boolean
}

interface ConfettiPiece {
  id: string
  delay: number
  xVelocity: number
  rotation: number
  color: string
}

const COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-cyan-500",
]

const generateConfetti = (): ConfettiPiece[] => {
  return Array.from({ length: 40 }, (_, i) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    return {
      id: `confetti-${i}`,
      delay: Math.random() * 0.2,
      xVelocity: (Math.random() - 0.5) * 400,
      rotation: Math.random() * 720,
      color: color || "bg-primary",
    }
  })
}

const ConfettiCelebration = ({ active }: ConfettiCelebrationProps) => {
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([])

  React.useEffect(() => {
    if (active) {
      setConfetti(generateConfetti())
    }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
                y: -20,
                opacity: 1,
              }}
              animate={{
                x:
                  (typeof window !== "undefined" ? window.innerWidth / 2 : 0) +
                  piece.xVelocity,
                y: typeof window !== "undefined" ? window.innerHeight + 20 : 0,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                delay: piece.delay,
                ease: "easeIn",
              }}
              className={`absolute h-1 w-1 rounded-full ${piece.color}`}
              style={{
                transform: `rotateZ(${piece.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

export { ConfettiCelebration }
