export type LeadTemperature = "cold" | "warm" | "hot"

export type ProductCategory =
  | "material_general"
  | "medio_contraste"
  | "equipo_medico"
  | "servicios_integrales"

export type LeadStatus = "new" | "in_progress" | "converted" | "lost"

export interface ConversationMessage {
  id: string
  content: string
  sender: "bot" | "user"
  timestamp: string
  step: number
}

export interface Note {
  id: string
  content: string
  author: string
  createdAt: string
}

export interface Reminder {
  id: string
  leadId: string
  leadName: string
  title: string
  description?: string
  dueDate: string
  completed: boolean
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  company?: string
  temperature: LeadTemperature
  productCategory: ProductCategory
  decisionTreeStep: number
  totalSteps: number
  createdAt: string
  updatedAt: string
  lastInteraction: string
  notes: Note[]
  reminders: Reminder[]
  conversation: ConversationMessage[]
  status: LeadStatus
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  material_general: "Material en General",
  medio_contraste: "Medio de Contraste",
  equipo_medico: "Equipo Medico",
  servicios_integrales: "Servicios Integrales",
}

export const TEMPERATURE_LABELS: Record<LeadTemperature, string> = {
  cold: "Frio",
  warm: "Tibio",
  hot: "Caliente",
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  in_progress: "En Progreso",
  converted: "Convertido",
  lost: "Perdido",
}
