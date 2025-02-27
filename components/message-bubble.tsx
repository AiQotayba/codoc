import { Brain, Stethoscope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AgentMessage } from "@/components/agent-message"

interface MessageBubbleProps {
   message: any
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex flex-row-reverse items-start gap-4 justify-start transition-opacity duration-200 ease-in-out hover:opacity-95">
      <div className="flex-shrink-0 transition-transform duration-200 ease-in-out hover:scale-105">
        {message.role === "assistant" ? (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
            <Brain className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>
      {message.role === "assistant" && typeof message.content === "object" ? (
        <AgentMessage data={message.content} />
      ) : (
        <Card
          className={cn(
            "max-w-[85%] p-5 transition-all duration-200 ease-in-out hover:shadow-md",
            message.role === "assistant"
              ? "bg-muted hover:bg-muted/90"
              : "bg-primary hover:bg-primary/90 text-primary-foreground",
          )}
        >
          <div className="whitespace-pre-wrap leading-relaxed">{message.content as string}</div>
        </Card>
      )}
    </div>
  )
}

