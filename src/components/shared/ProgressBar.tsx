import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/cn"

interface ProgressBarProps {
  current: number
  total: number
  labels?: string[]
  className?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ current, total, labels, className }, ref) => {
    const percentage = ((current + 1) / total) * 100

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)}>
        {/* Progress Bar */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, index) => (
            <motion.div
              key={index}
              className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
            >
              {index <= current ? (
                <motion.div
                  layoutId={`progress-fill-${index}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: index === current ? `${(percentage % 100) || 100}%` : "100%",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className={cn(
                    "h-full rounded-full",
                    index === current
                      ? "bg-primary shadow-[0_0_12px_rgba(var(--color-primary-rgb,245,158,11),0.6)]"
                      : "bg-primary"
                  )}
                />
              ) : (
                <div className="h-full w-0 bg-muted" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Labels - Desktop Only */}
        {labels && labels.length === total && (
          <div className="hidden md:grid gap-1.5 text-xs text-muted-foreground" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
            {labels.map((label, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "text-center truncate",
                  index <= current && "font-semibold text-foreground"
                )}
              >
                {label}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
