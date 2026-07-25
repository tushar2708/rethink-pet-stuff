import * as React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/cn"

interface PortalCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  className?: string
}

const PortalCard = React.forwardRef<HTMLAnchorElement, PortalCardProps>(
  ({ title, description, icon, href, color, className }, ref) => {
    return (
      <Link to={href} ref={ref} className="block no-underline">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Card className={cn("h-full overflow-hidden hover:shadow-lg transition-shadow", className)}>
            <CardContent className="flex flex-col gap-4 p-6">
              {/* Icon Circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full",
                  color.includes("bg-")
                    ? color
                    : `bg-${color}-500/20 text-${color}-500`
                )}
              >
                <div className="text-3xl">{icon}</div>
              </motion.div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {description}
                </CardDescription>
              </div>

              {/* CTA Arrow */}
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-2 text-primary text-sm font-semibold pt-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    )
  }
)

PortalCard.displayName = "PortalCard"

export { PortalCard }
