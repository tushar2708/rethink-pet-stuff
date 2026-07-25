import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/cn"

interface StepWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
  onNext?: () => void
  onPrev?: () => void
  isFirst?: boolean
  isLast?: boolean
  nextLabel?: string
  nextDisabled?: boolean
  showNav?: boolean
  className?: string
}

const StepWrapper = React.forwardRef<HTMLDivElement, StepWrapperProps>(
  (
    {
      title,
      description,
      children,
      onNext,
      onPrev,
      isFirst = false,
      isLast = false,
      nextLabel,
      nextDisabled = false,
      showNav = true,
      className,
    },
    ref
  ) => {
    const finalNextLabel = isLast ? nextLabel || "Complete" : nextLabel || "Next"

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={cn("flex flex-col gap-8 mx-auto w-full max-w-lg px-4 py-8", className)}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">{children}</div>

        {/* Navigation */}
        {showNav && (
          <div className="flex items-center gap-3">
            {!isFirst && (
              <Button
                variant="outline"
                size="default"
                onClick={onPrev}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="default"
              size="default"
              onClick={onNext}
              disabled={nextDisabled}
            >
              {finalNextLabel}
            </Button>
          </div>
        )}
      </motion.div>
    )
  }
)

StepWrapper.displayName = "StepWrapper"

export { StepWrapper }
