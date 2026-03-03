"use client"

import { createContext, useContext } from "react"
import type { Lead, LeadTemperature, LeadStatus, Note, Reminder } from "./types"

export interface DataStore {
  leads: Lead[]
  reminders: Reminder[]
  updateLeadTemperature: (leadId: string, temp: LeadTemperature) => void
  updateLeadStatus: (leadId: string, status: LeadStatus) => void
  addNote: (leadId: string, content: string) => void
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => void
  toggleReminder: (reminderId: string) => void
  addLead: (lead: Lead) => void
}

export const DataStoreContext = createContext<DataStore | null>(null)

export function useDataStore(): DataStore {
  const context = useContext(DataStoreContext)
  if (!context) {
    throw new Error("useDataStore must be used within a DataProvider")
  }
  return context
}
