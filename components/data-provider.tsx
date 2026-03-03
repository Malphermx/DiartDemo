"use client"

import { useState, type ReactNode } from "react"
import { DataStoreContext } from "@/lib/store"
import { mockLeads, mockReminders } from "@/lib/mock-data"
import type { Lead, LeadTemperature, LeadStatus, Reminder } from "@/lib/types"

export function DataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)

  const updateLeadTemperature = (leadId: string, temp: LeadTemperature) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, temperature: temp, updatedAt: new Date().toISOString() } : lead
      )
    )
  }

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status, updatedAt: new Date().toISOString() } : lead
      )
    )
  }

  const addNote = (leadId: string, content: string) => {
    const note = {
      id: `note-${Date.now()}`,
      content,
      author: "Admin",
      createdAt: new Date().toISOString(),
    }
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, notes: [...lead.notes, note], updatedAt: new Date().toISOString() }
          : lead
      )
    )
  }

  const addReminder = (reminder: Omit<Reminder, "id" | "createdAt">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setReminders((prev) => [...prev, newReminder])
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === reminder.leadId
          ? { ...lead, reminders: [...lead.reminders, newReminder] }
          : lead
      )
    )
  }

  const toggleReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, completed: !r.completed } : r))
    )
  }

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev])
  }

  return (
    <DataStoreContext.Provider
      value={{
        leads,
        reminders,
        updateLeadTemperature,
        updateLeadStatus,
        addNote,
        addReminder,
        toggleReminder,
        addLead,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}
