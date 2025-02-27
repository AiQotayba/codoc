"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  defaultValue?: string
}

export function ChatInput({ onSubmit, disabled, defaultValue = "" }: ChatInputProps) {
  const [input, setInput] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSubmit(input)
    setInput("")
  }

  // Auto resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    setInput(textarea.value)

    // Reset height
    textarea.style.height = "auto"

    // Set new height
    const newHeight = Math.min(textarea.scrollHeight, 200) // Max height of 200px
    textarea.style.height = `${newHeight}px`
  }

  // Handle Ctrl/Cmd + Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e)
    }
  }

  // Auto focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col relative item-center justify-end gap-3 m-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="pr-4 py-4 pl-12 text-base sm:text-lg resize-none min-h-[60px] max-h-[200px]"
          placeholder="اسأل عن أي شيء..."
          disabled={disabled}
        />
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            "w-max px-4 mx-2 left-0 absolute mb-3 transition-all duration-200",
            "top-1/2 -translate-y-1/2",
            !input.trim() && "opacity-50",
          )}
          size="lg"
        >
          <Send className="h-4 w-4 bg-white" />
        </Button>
      </div>
    </form>
  )
}

