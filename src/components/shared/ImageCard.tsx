import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/cn"

interface ImageCardProps {
  image?: string
  icon?: React.ReactNode
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
  mode?: "single" | "multi"
  className?: string
}

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  (
    {
      image,
      icon,
      label,
      description,
      selected,
      onSelect,
      mode = "single",
      className,
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect()
      }
    }

    const role = mode === "single" ? "radio" : "checkbox"
    const ariaLabel = `${label}${description ? `: ${description}` : ""}`

    return (
      <motion.div
        ref={ref}
        role={role}
        tabIndex={0}
        aria-checked={selected}
        aria-label={ariaLabel}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={selected ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-lg border-2 bg-card transition-all duration-200",
          selected
            ? "border-primary shadow-lg"
            : "border-border hover:border-primary/50 hover:shadow-md",
          className
        )}
      >
        {/* Image or Icon Container */}
        <div className="aspect-square w-full overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : icon ? (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-primary/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                {icon}
              </div>
            </div>
          ) : null}
        </div>

        {/* Selection Checkmark Overlay */}
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
          >
            <Check className="h-5 w-5" />
          </motion.div>
        )}

        {/* Text Content */}
        <div className="flex flex-col gap-1 p-3">
          <p className="font-semibold text-sm leading-tight text-card-foreground">
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    )
  }
)

ImageCard.displayName = "ImageCard"

export { ImageCard }
