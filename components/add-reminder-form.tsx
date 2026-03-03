"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function AddReminderForm({
  leadId,
  leadName,
  onSubmit,
}: {
  leadId: string
  leadName: string
  onSubmit: (data: {
    leadId: string
    leadName: string
    title: string
    description?: string
    dueDate: string
    completed: boolean
  }) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return

    onSubmit({
      leadId,
      leadName,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: date.toISOString(),
      completed: false,
    })

    setTitle("")
    setDescription("")
    setDate(undefined)
    toast.success("Recordatorio creado correctamente")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reminder-title" className="text-xs">Titulo</Label>
        <Input
          id="reminder-title"
          placeholder="Ej: Enviar cotizacion..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reminder-desc" className="text-xs">Descripcion (opcional)</Label>
        <Textarea
          id="reminder-desc"
          placeholder="Detalles adicionales..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[60px] resize-none text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Fecha</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal text-sm", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" size="sm" disabled={!title.trim() || !date} className="self-end gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Crear recordatorio
      </Button>
    </form>
  )
}
