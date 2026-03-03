import { cn } from "@/lib/utils"
import type { LeadTemperature } from "@/lib/types"
import { TEMPERATURE_LABELS } from "@/lib/types"
import { Snowflake, Sun, Flame } from "lucide-react"

const config: Record<LeadTemperature, { icon: typeof Snowflake; className: string }> = {
  cold: {
    icon: Snowflake,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  warm: {
    icon: Sun,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  hot: {
    icon: Flame,
    className: "bg-red-50 text-red-700 border-red-200",
  },
}

export function LeadTemperatureBadge({
  temperature,
  size = "default",
}: {
  temperature: LeadTemperature
  size?: "default" | "sm" | "lg"
}) {
  const { icon: Icon, className } = config[temperature]
  const label = TEMPERATURE_LABELS[temperature]

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    default: "px-2 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        className,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {label}
    </span>
  )
}
