"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Globe2,
  Lock,
  MessageCircle,
  Heart,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  Copy,
  CheckCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AgentResponse } from "@/types/chat"
import ReactMarkdown from "react-markdown"

export const agents = [
  {
    id: "translated_text_ar",
    title: "وكيل الترجمة",
    icon: Globe2,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    dir: "rtl",
  },
  {
    id: "privacy_check_output",
    title: "وكيل الخصوصية",
    icon: Lock,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    dir: "ltr",
  },
  {
    id: "information_gathering_output",
    title: "وكيل جمع المعلومات",
    icon: MessageCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    dir: "ltr",
  },
  {
    id: "initial_diagnosis_output",
    title: "وكيل التشخيص المبدئي",
    icon: Brain,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    dir: "ltr",
  },
  {
    id: "cardiac_consultation_output",
    title: "وكيل استشارة القلب",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    dir: "ltr",
  },
  {
    id: "medical_validation_output",
    title: "وكيل التحقق الطبي",
    icon: BookOpen,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    dir: "ltr",
  },
  {
    id: "final_report_ar",
    title: "التقرير النهائي",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    dir: "rtl",
  },
]

interface AgentMessageProps {
  data: AgentResponse
}

const MarkdownComponents = {
  h1: ({ ...props }) => <h1 className="text-xl font-bold mb-4 text-foreground" {...props} />,
  h2: ({ ...props }) => <h2 className="text-lg font-bold mb-3 text-foreground" {...props} />,
  h3: ({ ...props }) => <h3 className="text-base font-bold mb-2 text-foreground" {...props} />,
  p: ({ ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
  ul: ({ ...props }) => <ul className="mb-4 space-y-2 pr-4" {...props} />,
  li: ({ ...props }) => <li className="before:content-['•'] before:ml-2 before:text-primary" {...props} />,
  strong: ({ ...props }) => <strong className="font-bold text-foreground" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="border-r-4 border-primary/50 pr-4 my-4 text-muted-foreground italic" {...props} />
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline inline-flex items-center gap-1"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  ),
}

export function AgentMessage({ data }: AgentMessageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [currentAgent, setCurrentAgent] = useState(0)
  const [isProcessing, setIsProcessing] = useState(!data.final_report_ar)
  const [copied, setCopied] = useState(false)
  const [timePerAgent, setTimePerAgent] = useState(20000 / agents.length) // 20 seconds divided by number of agents

  useEffect(() => {
    setTimePerAgent(20000 / agents.length)
  }, [])

  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setCurrentAgent((prev) => {
          if (prev >= agents.length - 1) {
            setIsProcessing(false)
            clearInterval(timer)
            return prev
          }
          return prev + 1
        })
      }, timePerAgent)

      return () => clearInterval(timer)
    }
  }, [isProcessing, timePerAgent])

  const handleCopy = async () => {
    try {
      if (!data.final_report_ar) return
      await navigator.clipboard.writeText(data.final_report_ar)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="bg-muted p-5 transition-all duration-200 ease-in-out hover:shadow-md">
      <div className="space-y-6">
        {/* Processing Animation */}
        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {agents[currentAgent] && (
                <>
                  <div className={cn("rounded-md p-1.5", agents[currentAgent].bgColor)}>
                    {React.createElement(agents[currentAgent].icon, {
                      className: cn("h-4 w-4", agents[currentAgent].color),
                    })}
                  </div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {agents[currentAgent].title}
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                </>
              )}
            </div>
            <div className="h-1 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{
                  width: `${((currentAgent + 1) / agents.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Final Output (Always Visible) */}
        {!isProcessing && data?.final_report_ar && (
          <div className="space-y-4">
            <div className="flex items-center gap-2" dir="rtl">
              <div className={cn("rounded-md p-1.5", "bg-green-500/10")}>
                <CheckCircle2 className={cn("h-4 w-4", "text-green-500")} />
              </div>
              <div className="font-medium text-sm">النتيجة النهائية</div>
            </div>
            <div className="mr-7 border-r pr-4 text-sm leading-relaxed" dir="rtl">
              <ReactMarkdown components={MarkdownComponents}>{data.final_report_ar}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Copy Button - Now at the bottom */}
        {!isProcessing && data.final_report_ar && (
          <div className="flex justify-start pt-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-2 transition-all duration-200", copied && "text-green-500")}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  نسخ
                </>
              )}
            </Button>
          </div>
        )}
        {/* Toggle Button */}
        {!isProcessing && (
          <Button
            variant="outline"
            className="w-full mt-4 hover:bg-accent/50 transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex items-center gap-2">
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  إخفاء التفاصيل
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  عرض التفاصيل
                </>
              )}
            </div>
          </Button>
        )}

        {/* Other Agents (Toggleable) */}
        {!isProcessing && showDetails && (
          <div className="space-y-6 pt-4 border-t max-h-[70vh] overflow-y-auto">
            {agents.slice(0, -1).map((agent) => {
              const response = data[agent.id as keyof AgentResponse]
              if (!response) return null

              const Icon = agent.icon
              return (
                <div key={agent.id} className="space-y-2">
                  <div className="flex items-center gap-2" dir={"rtl"}>
                    <div className={cn("rounded-md p-1.5", agent.bgColor)}>
                      {React.createElement(Icon, { className: cn("h-4 w-4", agent.color) })}
                    </div>
                    <div className="font-medium text-sm">{agent.title}</div>
                  </div>
                  <div className="mr-7 border-r pr-4 text-sm leading-relaxed" dir={agent.dir}>
                    <ReactMarkdown components={MarkdownComponents}>{response}</ReactMarkdown>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}

