"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Globe2, Lock, MessageCircle, Heart, BookOpen, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentResponse {
  topic: string
  translation_agent: string
  privacy_agent: string
  first_line_support_agent: string
  diagnosis_agent: string
  cardiology_specialist_agent: string
  medical_knowledge_agent: string
  final_output_agent: string
}

interface AgentResponsesProps {
  data?: AgentResponse
  isLoading?: boolean
}

const agents = [
  {
    id: "translation_agent",
    title: "وكيل الترجمة",
    icon: Globe2,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    id: "privacy_agent",
    title: "وكيل الخصوصية",
    icon: Lock,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "first_line_support_agent",
    title: "وكيل الدعم الأولي",
    icon: MessageCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "diagnosis_agent",
    title: "وكيل التشخيص",
    icon: Brain,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "cardiology_specialist_agent",
    title: "وكيل أخصائي القلب",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: "medical_knowledge_agent",
    title: "وكيل المعرفة الطبية",
    icon: BookOpen,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: "final_output_agent",
    title: "وكيل المخرجات النهائية",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

export function AgentResponses({ data, isLoading = false }: AgentResponsesProps) {
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/30" />
          <p className="mt-2 text-sm text-muted-foreground">جاري معالجة الاستفسار...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <ScrollArea className="h-[70vh] px-4 ltr">
      <div className="space-y-6 pb-8">
        {/* Topic Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50 pb-4">
            <CardTitle className="text-lg font-medium">الموضوع</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm leading-relaxed">{data.topic || "لا يوجد موضوع محدد"}</p>
          </CardContent>
        </Card>

        {/* Agent Response Cards */}
        <div className="grid gap-6">
          {agents.map((agent) => {
            const response = data[agent.id as keyof AgentResponse]
            const Icon = agent.icon

            return (
              <Card key={agent.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 border-b bg-muted/50 pb-4">
                  <div className={cn("rounded-lg p-2.5", agent.bgColor)}>
                    <Icon className={cn("h-5 w-5", agent.color)} />
                  </div>
                  <CardTitle className="text-lg font-medium text-right w-full">{agent.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{response || "لم يتم توفير رد"}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}

