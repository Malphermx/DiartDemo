"use client"

import { type ReactNode } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { DataProvider } from "@/components/data-provider"

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  )
}
