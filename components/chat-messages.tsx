"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Brain, ArrowDown } from "lucide-react"
import type { Message } from "@/types/chat"
import { MessageCard } from "./message-card"
import { AgentMessage } from "@/components/agent-message"
import { Button } from "@/components/ui/button"
import React from "react"
import { AgentLoadingSequence, ThinkingMessage } from "@/components/loading-states"

interface ChatMessagesProps {
  messages: Message[]
  thinking?: boolean
  agentProcessing?: boolean
}

export function ChatMessages({ messages, thinking, agentProcessing }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  // Simple scroll to bottom function
  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length, scrollToBottom]) // Only run when messages length changes

  // Handle scroll events with debounce
  const handleScroll:any = React.useCallback(() => {
    if (!scrollRef.current) return

    // Cancel any pending animation frame
    if (handleScroll.frameId) {
      cancelAnimationFrame(handleScroll.frameId)
    }

    // Schedule new animation frame
    handleScroll.frameId = requestAnimationFrame(() => {
      if (scrollRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = scrollRef.current
        const shouldShow = scrollHeight - scrollTop - clientHeight > 100
        setShowScrollButton(shouldShow)
      }
    })
  }, []) // Remove showScrollButton from dependencies

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (handleScroll.frameId) {
        cancelAnimationFrame(handleScroll.frameId)
      }
    }
  }, [handleScroll])

  return (
    <div className="relative flex-1">
      <ScrollArea
        ref={scrollRef}
        className="h-full px-4 pt-6"
        onScrollCapture={handleScroll}
        style={{ height: "calc(100vh - 12rem)" }}
      >
        <div className="space-y-8 max-w-3xl mx-auto pb-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">كيف يمكنني مساعدتك اليوم؟</h2>
                <p className="text-sm text-muted-foreground">
                  يمكنك سؤالي عن أي استفسار طبي ولدي خبرة في مختلف التخصصات
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  className="animate-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                  key={message.id}
                >
                  {message.role === "assistant" && typeof message.content === "object" ? (
                    <AgentMessage data={message.content} />
                  ) : (
                    <MessageCard role={message.role} content={message.content as string} />
                  )}
                </div>
              ))}

              {/* Initial Thinking State - Shows first */}
              {thinking && <ThinkingMessage />}

              {/* Agent Processing State - Shows after thinking */}
              {agentProcessing && !thinking && (
                <div className="flex flex-row-reverse items-start gap-3 justify-start animate-in fade-in-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <Card className="max-w-[85%] p-5 bg-muted">
                    <AgentLoadingSequence />
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {showScrollButton && (
        <Button
          size="icon"
          className="absolute bottom-4 left-4 rounded-full shadow-lg animate-in fade-in-0 z-10"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

