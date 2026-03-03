"use client"

import { use, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useDataStore } from "@/lib/store"
import {
  PRODUCT_CATEGORY_LABELS,
  TEMPERATURE_LABELS,
  STATUS_LABELS,
} from "@/lib/types"
import type { LeadTemperature, LeadStatus } from "@/lib/types"
import { LeadTemperatureBadge } from "@/components/lead-temperature-badge"
import { DecisionTreeProgress } from "@/components/decision-tree-progress"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { AddNoteForm } from "@/components/add-note-form"
import { AddReminderForm } from "@/components/add-reminder-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  StickyNote,
  Bell,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const {
    leads,
    reminders,
    updateLeadTemperature,
    updateLeadStatus,
    addNote,
    addReminder,
    toggleReminder,
  } = useDataStore()

  const lead = useMemo(() => leads.find((l) => l.id === id), [leads, id])
  const leadReminders = useMemo(
    () => reminders.filter((r) => r.leadId === id).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [reminders, id]
  )

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Lead no encontrado</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/leads")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a leads
        </Button>
      </div>
    )
  }

  const handleTemperatureChange = (value: string) => {
    updateLeadTemperature(lead.id, value as LeadTemperature)
    toast.success(`Temperatura actualizada a ${TEMPERATURE_LABELS[value as LeadTemperature]}`)
  }

  const handleStatusChange = (value: string) => {
    updateLeadStatus(lead.id, value as LeadStatus)
    toast.success(`Estado actualizado a ${STATUS_LABELS[value as LeadStatus]}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/leads")} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight text-foreground">{lead.name}</h1>
            <LeadTemperatureBadge temperature={lead.temperature} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {PRODUCT_CATEGORY_LABELS[lead.productCategory]}
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Info panel */}
        <div className="flex flex-col gap-4">
          {/* Contact info */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Informacion del Contacto</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{lead.phone}</span>
              </div>
              {lead.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{lead.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  Creado {format(new Date(lead.createdAt), "dd MMM yyyy", { locale: es })}
                </span>
              </div>

              <Separator />

              {/* Temperature control */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Temperatura</label>
                <Select value={lead.temperature} onValueChange={handleTemperatureChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(TEMPERATURE_LABELS) as [LeadTemperature, string][]).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status control */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Estado</label>
                <Select value={lead.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Decision tree progress */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Progreso en el arbol de decisiones</label>
                <DecisionTreeProgress
                  currentStep={lead.decisionTreeStep}
                  totalSteps={lead.totalSteps}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center: WhatsApp conversation */}
        <Card className="border-border/60 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Conversacion de WhatsApp</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              {lead.conversation.length} mensajes - Hasta paso {lead.decisionTreeStep} de {lead.totalSteps}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <WhatsAppChat
              messages={lead.conversation}
              abandonedAtStep={lead.decisionTreeStep}
            />
          </CardContent>
        </Card>

        {/* Right: Follow-up panel */}
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="notes" className="flex-1 gap-1.5 text-xs">
                <StickyNote className="h-3.5 w-3.5" />
                Notas ({lead.notes.length})
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex-1 gap-1.5 text-xs">
                <Bell className="h-3.5 w-3.5" />
                Recordatorios ({leadReminders.length})
              </TabsTrigger>
            </TabsList>

            {/* Notes tab */}
            <TabsContent value="notes" className="mt-3">
              <Card className="border-border/60">
                <CardContent className="p-4 flex flex-col gap-4">
                  <AddNoteForm onSubmit={(content) => addNote(lead.id, content)} />

                  {lead.notes.length > 0 && (
                    <>
                      <Separator />
                      <ScrollArea className="max-h-[350px]">
                        <div className="flex flex-col gap-3">
                          {[...lead.notes].reverse().map((note) => (
                            <div key={note.id} className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3">
                              <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                                <span className="font-medium">{note.author}</span>
                                <span>-</span>
                                <span>{format(new Date(note.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </>
                  )}

                  {lead.notes.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Sin notas internas aun
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reminders tab */}
            <TabsContent value="reminders" className="mt-3">
              <Card className="border-border/60">
                <CardContent className="p-4 flex flex-col gap-4">
                  <AddReminderForm
                    leadId={lead.id}
                    leadName={lead.name}
                    onSubmit={addReminder}
                  />

                  {leadReminders.length > 0 && (
                    <>
                      <Separator />
                      <ScrollArea className="max-h-[300px]">
                        <div className="flex flex-col gap-2">
                          {leadReminders.map((reminder) => {
                            const dueDate = new Date(reminder.dueDate)
                            const now = new Date()
                            const isOverdue = !reminder.completed && dueDate < now
                            const isToday = dueDate.toDateString() === now.toDateString()

                            return (
                              <div
                                key={reminder.id}
                                className="flex items-start gap-2 rounded-lg border border-border/40 p-3"
                              >
                                <button
                                  onClick={() => toggleReminder(reminder.id)}
                                  className="mt-0.5 shrink-0"
                                  aria-label={reminder.completed ? "Marcar como pendiente" : "Marcar como completado"}
                                >
                                  {reminder.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Circle className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`} />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium leading-tight ${reminder.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {reminder.title}
                                  </p>
                                  {reminder.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{reminder.description}</p>
                                  )}
                                  <p className={`text-[10px] mt-1 font-medium ${
                                    reminder.completed
                                      ? "text-muted-foreground"
                                      : isOverdue
                                        ? "text-red-500"
                                        : isToday
                                          ? "text-amber-500"
                                          : "text-muted-foreground"
                                  }`}>
                                    {format(dueDate, "dd MMM yyyy", { locale: es })}
                                    {!reminder.completed && isOverdue && " - Vencido"}
                                    {!reminder.completed && isToday && " - Hoy"}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </>
                  )}

                  {leadReminders.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Sin recordatorios aun
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
