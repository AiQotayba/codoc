"use client"

import type React from "react"

import { AgentResponses } from "@/components/agent-responses"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useState } from "react"

// This is a mock API call - replace with your actual API implementation
async function fetchAgentResponses(topic: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock response
  return {
    topic,
    translation_agent: "تمت معالجة النص وترجمته",
    privacy_agent: "تم التحقق من معايير الخصوصية",
    first_line_support_agent: "تم تقييم الحالة الأولي",
    diagnosis_agent: "تم تحليل الأعراض وتقديم التشخيص المبدئي",
    cardiology_specialist_agent: "تم مراجعة الحالة من منظور طب القلب",
    medical_knowledge_agent: "تم تقديم المعلومات الطبية ذات الصلة",
    final_output_agent: "تم تجميع وتنسيق المخرجات النهائية",
  }
}

export default function AgentsPage() {
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || isLoading) return

    setIsLoading(true)
    try {
      const data = await fetchAgentResponses(topic)
      setResponse(data)
    } catch (error) {
      console.error("Error fetching responses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card className="mx-auto max-w-3xl p-4">
          <form onSubmit={handleSubmit} className="flex flex-col relative items-center justify-end gap-3">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px] resize-none pl-12 pr-4 py-4 text-base sm:text-lg"
              placeholder="اكتب موضوع استفسارك هنا..."
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="absolute left-0 mb-4 mt-[-60px] mx-2 w-max px-4"
              size="lg"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="mx-auto max-w-5xl">
          <AgentResponses data={response} isLoading={isLoading} />
        </div>
      </div>

      <p className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 p-2 text-center text-sm text-muted-foreground backdrop-blur-sm">
        يجب التحقق من المعلومات المهمة. لذلك يمكن أن تصدر عن نان بعض الأخطاء
      </p>
    </main>
  )
}

