"use client"

import { createContext, useContext } from "react"

export interface AuthState {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const VALID_CREDENTIALS = {
  email: "admin@diart.com",
  password: "diart2024",
  name: "Administrador DIART",
}

export function validateCredentials(email: string, password: string): { email: string; name: string } | null {
  if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
    return { email: VALID_CREDENTIALS.email, name: VALID_CREDENTIALS.name }
  }
  return null
}
