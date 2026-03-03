"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useDataStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Circle, Bell, Clock, ArrowRight } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function RemindersPage() {
  const { reminders, toggleReminder } = useDataStore()

  const pending = useMemo(
    () =>
      reminders
        .filter((r) => !r.completed)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [reminders]
  )

  const completed = useMemo(
    () =>
      reminders
        .filter((r) => r.completed)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reminders]
  )

  const now = new Date()
  const overdue = pending.filter((r) => new Date(r.dueDate) < now)
  const today = pending.filter(
    (r) => new Date(r.dueDate).toDateString() === now.toDateString() && new Date(r.dueDate) >= now
  )
  const upcoming = pending.filter(
    (r) => new Date(r.dueDate) > now && new Date(r.dueDate).toDateString() !== now.toDateString()
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recordatorios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pending.length} pendientes - {overdue.length} vencidos
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overdue.length}</p>
                <p className="text-xs text-muted-foreground">Vencidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{today.length}</p>
                <p className="text-xs text-muted-foreground">Para hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                <p className="text-xs text-muted-foreground">Proximos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completed.length}</p>
                <p className="text-xs text-muted-foreground">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Bell className="h-4 w-4" />
            Pendientes ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Completados ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="flex flex-col gap-6">
            {/* Overdue section */}
            {overdue.length > 0 && (
              <ReminderSection
                title="Vencidos"
                reminders={overdue}
                toggleReminder={toggleReminder}
                variant="overdue"
              />
            )}

            {/* Today section */}
            {today.length > 0 && (
              <ReminderSection
                title="Hoy"
                reminders={today}
                toggleReminder={toggleReminder}
                variant="today"
              />
            )}

            {/* Upcoming section */}
            {upcoming.length > 0 && (
              <ReminderSection
                title="Proximos"
                reminders={upcoming}
                toggleReminder={toggleReminder}
                variant="upcoming"
              />
            )}

            {pending.length === 0 && (
              <Card className="border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <p className="text-sm text-muted-foreground">Sin recordatorios pendientes</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/leads">Ir a Leads</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completed.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Sin recordatorios completados</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60">
              <CardContent className="p-4">
                <ScrollArea className="max-h-[500px]">
                  <div className="flex flex-col gap-2">
                    {completed.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        toggleReminder={toggleReminder}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReminderSection({
  title,
  reminders,
  toggleReminder,
  variant,
}: {
  title: string
  reminders: ReturnType<typeof useDataStore>["reminders"]
  toggleReminder: (id: string) => void
  variant: "overdue" | "today" | "upcoming"
}) {
  const headerColors = {
    overdue: "text-red-700 bg-red-50 border-red-200",
    today: "text-amber-700 bg-amber-50 border-amber-200",
    upcoming: "text-blue-700 bg-blue-50 border-blue-200",
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className={`py-2.5 px-4 border-b ${headerColors[variant]}`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <span className="text-xs font-bold opacity-80">{reminders.length}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          {reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              toggleReminder={toggleReminder}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ReminderItem({
  reminder,
  toggleReminder,
}: {
  reminder: ReturnType<typeof useDataStore>["reminders"][number]
  toggleReminder: (id: string) => void
}) {
  const dueDate = new Date(reminder.dueDate)
  const now = new Date()
  const isOverdue = !reminder.completed && dueDate < now
  const isToday = dueDate.toDateString() === now.toDateString()

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-accent/30">
      <button
        onClick={() => toggleReminder(reminder.id)}
        className="mt-0.5 shrink-0"
        aria-label={reminder.completed ? "Marcar como pendiente" : "Marcar como completado"}
      >
        {reminder.completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : (
          <Circle className={`h-5 w-5 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`} />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-tight ${reminder.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {reminder.title}
        </p>
        {reminder.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <p className={`text-xs font-medium ${
            reminder.completed
              ? "text-muted-foreground"
              : isOverdue
                ? "text-red-500"
                : isToday
                  ? "text-amber-600"
                  : "text-muted-foreground"
          }`}>
            {format(dueDate, "dd MMM yyyy", { locale: es })}
            {!reminder.completed && isOverdue && " - Vencido"}
            {!reminder.completed && isToday && " - Hoy"}
          </p>
          <Link
            href={`/dashboard/leads/${reminder.leadId}`}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {reminder.leadName}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
