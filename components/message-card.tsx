"use client"

import { Card } from "@/components/ui/card"
import { Brain, Stethoscope, Copy, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MessageCardProps {
  role: "user" | "assistant"
  content: string
}

export function MessageCard({ role, content }: MessageCardProps) {
  const [copied, setCopied] = useState(false)
  const Icon = role === "assistant" ? Brain : Stethoscope
  const isAssistant = role === "assistant"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="flex flex-row-reverse items-start gap-4 justify-start group">
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-105",
            isAssistant ? "bg-primary/10" : "bg-primary",
          )}
        >
          <Icon className={cn("h-5 w-5", isAssistant ? "text-primary" : "text-primary-foreground")} />
        </div>
      </div>
      <div className="relative flex-1 max-w-[85%]">
        <Card
          className={cn(
            "p-5 transition-all duration-200 ease-in-out hover:shadow-md",
            isAssistant ? "bg-muted hover:bg-muted/90" : "bg-primary hover:bg-primary/90 text-primary-foreground",
          )}
        >
          <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        </Card>

        {/* Copy button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -left-12 top-2 opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100",
            copied && "text-green-500",
          )}
          onClick={handleCopy}
        >
          {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

