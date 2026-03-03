import Link from "next/link"
import type { Lead } from "@/lib/types"
import { PRODUCT_CATEGORY_LABELS, STATUS_LABELS } from "@/lib/types"
import { DecisionTreeProgress } from "@/components/decision-tree-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Building2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Link href={`/dashboard/leads/${lead.id}`}>
      <Card className="border-border/40 transition-all hover:border-border hover:shadow-sm cursor-pointer">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-foreground leading-tight">{lead.name}</h3>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0 ml-2">
                {STATUS_LABELS[lead.status]}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span className="truncate">{lead.phone}</span>
              </div>
              {lead.company && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 shrink-0" />
                  <span className="truncate">{lead.company}</span>
                </div>
              )}
            </div>

            <div className="rounded-md bg-muted/50 px-2 py-1.5">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">
                {PRODUCT_CATEGORY_LABELS[lead.productCategory]}
              </p>
              <DecisionTreeProgress
                currentStep={lead.decisionTreeStep}
                totalSteps={lead.totalSteps}
                showLabel={false}
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(lead.lastInteraction), { addSuffix: true, locale: es })}
            </div>

            {lead.notes.length > 0 && (
              <p className="text-[10px] text-muted-foreground border-t border-border/30 pt-2 line-clamp-2">
                {lead.notes[lead.notes.length - 1].content}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
