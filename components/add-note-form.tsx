"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { toast } from "sonner"

export function AddNoteForm({
  onSubmit,
}: {
  onSubmit: (content: string) => void
}) {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    onSubmit(content.trim())
    setContent("")
    toast.success("Nota agregada correctamente")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        placeholder="Escribir nota interna..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] resize-none text-sm"
      />
      <Button type="submit" size="sm" disabled={!content.trim()} className="self-end gap-1.5">
        <Send className="h-3.5 w-3.5" />
        Agregar nota
      </Button>
    </form>
  )
}
