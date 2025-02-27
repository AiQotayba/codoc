"use client"

import React from "react"
import { Brain, Loader2, Globe2, Lock, MessageCircle, Heart, BookOpen, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Separate component for sequential agent loading
export function AgentLoadingSequence() {
  const [currentAgentIndex, setCurrentAgentIndex] = React.useState(0)
  const [showInitialMessage, setShowInitialMessage] = React.useState(true)
  const totalDuration = 20000 // 20 seconds
  const initialMessageDuration = 2000 // 2 seconds for initial message

  const agentsWithIcons = [
    { title: "وكيل الترجمة", icon: Globe2, color: "text-sky-500", bgColor: "bg-sky-500/10" },
    { title: "وكيل الخصوصية", icon: Lock, color: "text-violet-500", bgColor: "bg-violet-500/10" },
    { title: "وكيل جمع المعلومات", icon: MessageCircle, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { title: "وكيل التشخيص المبدئي", icon: Brain, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { title: "وكيل استشارة القلب", icon: Heart, color: "text-red-500", bgColor: "bg-red-500/10" },
    { title: "وكيل التحقق الطبي", icon: BookOpen, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
    { title: "التقرير النهائي", icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
  ]

  // Handle initial message and agent transitions
  React.useEffect(() => {
    // Show initial message for 2 seconds
    const initialTimer = setTimeout(() => {
      setShowInitialMessage(false)
    }, initialMessageDuration)

    // Start agent sequence after initial message
    const agentTimer = setInterval(
      () => {
        setCurrentAgentIndex((prev) => {
          if (prev >= agentsWithIcons.length - 1) {
            clearInterval(agentTimer)
            return prev
          }
          return prev + 1
        })
      },
      (totalDuration - initialMessageDuration) / agentsWithIcons.length,
    )

    return () => {
      clearTimeout(initialTimer)
      clearInterval(agentTimer)
    }
  }, [agentsWithIcons.length])

  if (showInitialMessage) {
    return (
      <div className="text-muted-foreground animate-pulse flex items-center gap-2">
        جاري معالجة البيانات...
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  const currentAgent = agentsWithIcons[currentAgentIndex]
  const progress = ((currentAgentIndex + 1) / agentsWithIcons.length) * 100

  return (
    <div className="space-y-4">
      {/* Show only current agent */}
      <div className="flex items-center gap-2">
        <div className={cn("rounded-md p-1.5", currentAgent.bgColor)}>
          {React.createElement(currentAgent.icon, {
            className: cn("h-4 w-4", currentAgent.color),
          })}
        </div>
        <div className="font-medium text-sm flex items-center gap-2">
          {currentAgent.title}
          <Loader2 className="h-3 w-3 animate-spin" />
        </div>
      </div>

      {/* Previous agents in dimmed state */}
      {currentAgentIndex > 0 && (
        <div className="space-y-2 opacity-60">
          {agentsWithIcons.slice(0, currentAgentIndex).map((agent, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={cn("rounded-md p-1.5", agent.bgColor)}>
                {React.createElement(agent.icon, {
                  className: cn("h-4 w-4", agent.color),
                })}
              </div>
              <div className="font-medium text-sm">{agent.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export function ThinkingMessage() {
  const [currentAgentIndex, setCurrentAgentIndex] = React.useState(-1)
  const [showInitialMessage, setShowInitialMessage] = React.useState(true)

  const agents = [
    { title: "وكيل الترجمة", icon: Globe2, color: "text-sky-500", bgColor: "bg-sky-500/10" },
    { title: "وكيل الخصوصية", icon: Lock, color: "text-violet-500", bgColor: "bg-violet-500/10" },
    { title: "وكيل جمع المعلومات", icon: MessageCircle, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { title: "وكيل التشخيص المبدئي", icon: Brain, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { title: "وكيل استشارة القلب", icon: Heart, color: "text-red-500", bgColor: "bg-red-500/10" },
    { title: "وكيل التحقق الطبي", icon: BookOpen, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
    { title: "التقرير النهائي", icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
  ]

  React.useEffect(() => {
    // Show initial message for 1 second
    const initialTimer = setTimeout(() => {
      setShowInitialMessage(false)
      setCurrentAgentIndex(0)
    }, 1000)

    // Start cycling through agents
    const interval = setInterval(() => {
      setCurrentAgentIndex((prev) => {
        if (prev >= agents.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 5000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [agents.length])

  return (
    <div className="flex flex-row-reverse items-start gap-3 justify-start animate-in fade-in-0">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Brain className="h-5 w-5 text-primary" />
        </div>
      </div>
      <Card className="max-w-[85%] p-5 bg-muted w-full">
        <div className="space-y-4">
          {showInitialMessage ? (
            <div className="text-muted-foreground animate-pulse flex items-center gap-2">
              جاري التفكير...
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {agents.map((agent, index) => {
                  const isActive = index === currentAgentIndex
                  const isPast = index < currentAgentIndex
                  const Icon = agent.icon

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-2 transition-all duration-300",
                        !isActive && "hidden",
                        !isActive && !isPast && "opacity-40",
                        isPast && "opacity-60",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-md p-1.5 transition-colors",
                          isActive ? agent.bgColor : "bg-muted-foreground/10",
                        )}
                      >
                        <Icon
                          className={cn("h-4 w-4 transition-colors", isActive ? agent.color : "text-muted-foreground")}
                        />
                      </div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {agent.title}
                        {isActive && <Loader2 className="h-3 w-3 animate-spin" />}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="h-1 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentAgentIndex + 1) / agents.length) * 100}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

