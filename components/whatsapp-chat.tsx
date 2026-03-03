import type { ConversationMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Bot, User } from "lucide-react"

export function WhatsAppChat({
  messages,
  abandonedAtStep,
}: {
  messages: ConversationMessage[]
  abandonedAtStep: number
}) {
  return (
    <ScrollArea className="h-[500px] w-full">
      <div
        className="flex flex-col gap-3 p-4"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        {/* WhatsApp-style header */}
        <div className="flex items-center justify-center">
          <span className="text-[10px] bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
            Conversacion del bot DIART
          </span>
        </div>

        {messages.map((message, index) => {
          const isBot = message.sender === "bot"
          const isLastMessageAtStep = index === messages.length - 1

          return (
            <div key={message.id} className="flex flex-col gap-1">
              {/* Step indicator when step changes */}
              {(index === 0 || messages[index - 1].step !== message.step) && (
                <div className="flex items-center justify-center my-1">
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Paso {message.step}
                  </span>
                </div>
              )}

              <div className={cn("flex gap-2 max-w-[85%]", isBot ? "self-start" : "self-end flex-row-reverse")}>
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-1",
                  isBot ? "bg-muted" : "bg-emerald-100"
                )}>
                  {isBot ? (
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-emerald-700" />
                  )}
                </div>

                <div className={cn(
                  "rounded-xl px-3 py-2 shadow-sm",
                  isBot
                    ? "bg-card border border-border/60 rounded-tl-sm"
                    : "bg-emerald-600 text-white rounded-tr-sm"
                )}>
                  <p className={cn(
                    "text-sm whitespace-pre-line leading-relaxed",
                    isBot ? "text-foreground" : "text-white"
                  )}>
                    {message.content}
                  </p>
                  <p className={cn(
                    "text-[10px] mt-1 text-right",
                    isBot ? "text-muted-foreground" : "text-emerald-200"
                  )}>
                    {format(new Date(message.timestamp), "dd MMM, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>

              {/* Abandon indicator */}
              {isLastMessageAtStep && message.step === abandonedAtStep && index === messages.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full font-medium">
                    El cliente se detuvo aqui (paso {abandonedAtStep})
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
