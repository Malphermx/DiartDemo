"use client"

import Link from "next/link"
import { useDataStore } from "@/lib/store"
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types"
import type { ProductCategory } from "@/lib/types"
import { StatsCard } from "@/components/stats-card"
import { LeadTemperatureBadge } from "@/components/lead-temperature-badge"
import { DecisionTreeProgress } from "@/components/decision-tree-progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Users, Snowflake, Sun, Flame, Bell, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const PIE_COLORS = {
  cold: "#3b82f6",
  warm: "#f59e0b",
  hot: "#ef4444",
}

export default function DashboardPage() {
  const { leads, reminders } = useDataStore()

  const coldLeads = leads.filter((l) => l.temperature === "cold")
  const warmLeads = leads.filter((l) => l.temperature === "warm")
  const hotLeads = leads.filter((l) => l.temperature === "hot")

  const pendingReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4)

  // Data for pie chart
  const pieData = [
    { name: "Frio", value: coldLeads.length, fill: PIE_COLORS.cold },
    { name: "Tibio", value: warmLeads.length, fill: PIE_COLORS.warm },
    { name: "Caliente", value: hotLeads.length, fill: PIE_COLORS.hot },
  ]

  const pieConfig: ChartConfig = {
    cold: { label: "Frio", color: PIE_COLORS.cold },
    warm: { label: "Tibio", color: PIE_COLORS.warm },
    hot: { label: "Caliente", color: PIE_COLORS.hot },
  }

  // Data for bar chart by product
  const productCounts = Object.entries(PRODUCT_CATEGORY_LABELS).map(([key, label]) => ({
    product: label.length > 15 ? label.substring(0, 15) + "..." : label,
    fullLabel: label,
    count: leads.filter((l) => l.productCategory === key as ProductCategory).length,
  }))

  const barConfig: ChartConfig = {
    count: { label: "Leads", color: "oklch(0.40 0.12 260)" },
  }

  // Recent leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vista general de leads y actividad reciente
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={leads.length}
          icon={Users}
          description={`${leads.filter((l) => l.status === "in_progress").length} en progreso`}
        />
        <StatsCard
          title="Calientes"
          value={hotLeads.length}
          icon={Flame}
          description="Listos para cerrar"
          iconClassName="text-red-600"
          iconBgClassName="bg-red-50"
        />
        <StatsCard
          title="Tibios"
          value={warmLeads.length}
          icon={Sun}
          description="En proceso"
          iconClassName="text-amber-600"
          iconBgClassName="bg-amber-50"
        />
        <StatsCard
          title="Frios"
          value={coldLeads.length}
          icon={Snowflake}
          description="Necesitan seguimiento"
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie chart - Temperature distribution */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribucion por Temperatura</CardTitle>
            <CardDescription>Segmentacion actual de leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="mx-auto aspect-square max-h-[260px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={2}
                  stroke="var(--color-card)"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                  <span className="font-semibold text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar chart - Products */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Leads por Categoria</CardTitle>
            <CardDescription>Distribucion por area de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-[260px] w-full">
              <BarChart
                data={productCounts}
                layout="vertical"
                margin={{ left: 0, right: 12, top: 8, bottom: 8 }}
              >
                <YAxis
                  dataKey="product"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                  barSize={28}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent leads */}
        <Card className="md:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Leads Recientes</CardTitle>
                <CardDescription>Ultimos leads recibidos del bot de WhatsApp</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/leads" className="flex items-center gap-1 text-xs">
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border/40 p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                      <LeadTemperatureBadge temperature={lead.temperature} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {PRODUCT_CATEGORY_LABELS[lead.productCategory]} - {lead.phone}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <DecisionTreeProgress
                      currentStep={lead.decisionTreeStep}
                      totalSteps={lead.totalSteps}
                      showLabel={false}
                      className="w-20"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming reminders */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recordatorios</CardTitle>
                <CardDescription>Proximos seguimientos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/reminders" className="flex items-center gap-1 text-xs">
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {pendingReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sin recordatorios pendientes
                </p>
              ) : (
                pendingReminders.map((reminder) => {
                  const dueDate = new Date(reminder.dueDate)
                  const now = new Date()
                  const isOverdue = dueDate < now
                  const isToday = dueDate.toDateString() === now.toDateString()

                  return (
                    <div
                      key={reminder.id}
                      className="flex items-start gap-3 rounded-lg border border-border/40 p-3"
                    >
                      <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${
                        isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-muted-foreground"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{reminder.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {reminder.leadName}
                        </p>
                        <p className={`text-[10px] mt-1 font-medium ${
                          isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-muted-foreground"
                        }`}>
                          {isOverdue ? "Vencido" : isToday ? "Hoy" : formatDistanceToNow(dueDate, { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
