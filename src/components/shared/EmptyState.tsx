import * as React from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/cn"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex flex-col items-center justify-center gap-4 py-12 px-4 text-center", className)}
      >
        {icon && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
            className="text-muted-foreground"
          >
            {icon}
          </motion.div>
        )}

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
          )}
        </div>

        {action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-2"
          >
            <Button variant="default" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          </motion.div>
        )}
      </motion.div>
    )
  }
)

EmptyState.displayName = "EmptyState"

export { EmptyState }
