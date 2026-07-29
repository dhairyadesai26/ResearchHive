import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cn(
      "badge",
      variant === "default" && "badge-default",
      variant === "outline" && "badge-outline",
      variant === "violet" && "badge-violet",
      variant === "cyan" && "badge-cyan",
      variant === "pink" && "badge-pink",
      variant === "emerald" && "badge-emerald",
      className
    )} {...props} />
  )
}

export { Badge }
