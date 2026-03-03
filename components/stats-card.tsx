import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  iconClassName,
  iconBgClassName,
}: {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  iconClassName?: string
  iconBgClassName?: string
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBgClassName ?? "bg-primary/10")}>
            <Icon className={cn("h-5 w-5", iconClassName ?? "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
