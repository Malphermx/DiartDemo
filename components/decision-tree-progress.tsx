import { cn } from "@/lib/utils"

export function DecisionTreeProgress({
  currentStep,
  totalSteps,
  showLabel = true,
  className,
}: {
  currentStep: number
  totalSteps: number
  showLabel?: boolean
  className?: string
}) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  const getBarColor = () => {
    if (percentage <= 33) return "bg-blue-500"
    if (percentage <= 66) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Paso {currentStep} de {totalSteps}</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
