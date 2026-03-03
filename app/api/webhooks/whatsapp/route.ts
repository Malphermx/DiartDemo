import { NextResponse } from "next/server"
import { z } from "zod"

const messageSchema = z.object({
  content: z.string().min(1),
  sender: z.enum(["bot", "user"]),
  timestamp: z.string().datetime().optional(),
  step: z.number().int().min(1),
})

const webhookSchema = z.object({
  leadId: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El telefono es requerido"),
  company: z.string().optional(),
  productCategory: z.enum([
    "material_general",
    "medio_contraste",
    "equipo_medico",
    "servicios_integrales",
  ]),
  decisionTreeStep: z.number().int().min(1).max(10),
  totalSteps: z.number().int().min(1).default(10),
  temperature: z.enum(["cold", "warm", "hot"]).optional(),
  conversation: z.array(messageSchema).min(1),
})

function computeTemperature(step: number, total: number): "cold" | "warm" | "hot" {
  const ratio = step / total
  if (ratio <= 0.33) return "cold"
  if (ratio <= 0.7) return "warm"
  return "hot"
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = webhookSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos invalidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = parsed.data
    const temperature =
      data.temperature ?? computeTemperature(data.decisionTreeStep, data.totalSteps)

    const lead = {
      id: data.leadId ?? `lead-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      company: data.company,
      temperature,
      productCategory: data.productCategory,
      decisionTreeStep: data.decisionTreeStep,
      totalSteps: data.totalSteps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      status: temperature === "hot" ? "in_progress" : "new",
      notes: [],
      reminders: [],
      conversation: data.conversation.map((msg, i) => ({
        id: `msg-${Date.now()}-${i}`,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp ?? new Date().toISOString(),
        step: msg.step,
      })),
    }

    // In production, this would save to a database.
    // For now, we just return the processed lead.
    return NextResponse.json(
      {
        success: true,
        lead,
        message: `Lead recibido: ${lead.name} (${temperature})`,
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: "DIART WhatsApp Webhook",
    status: "active",
    endpoints: {
      POST: {
        description: "Recibir datos de conversacion de WhatsApp",
        body: {
          name: "string (requerido)",
          phone: "string (requerido)",
          company: "string (opcional)",
          productCategory: "material_general | medio_contraste | equipo_medico | servicios_integrales",
          decisionTreeStep: "number 1-10",
          totalSteps: "number (default: 10)",
          temperature: "cold | warm | hot (opcional, se calcula automaticamente)",
          conversation: "array de mensajes [{content, sender, timestamp?, step}]",
        },
      },
    },
  })
}
