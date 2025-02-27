"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ListChecks, FileText, Stethoscope, Lightbulb, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedLogo } from "@/components/animated-logo"

const actionButtons = [
  {
    icon: Stethoscope,
    label: "تشخيص الحالة",
    color: "text-primary",
    bgColor: "bg-[#00b2b3]/10",
  },
  {
    icon: FileText,
    label: "تلخيص التقارير",
    color: "text-primary",
    bgColor: "bg-[#00b2b3]/10",
  },
  {
    icon: ListChecks,
    label: "خطة العلاج",
    color: "text-primary",
    bgColor: "bg-[#00b2b3]/10",
  },
  {
    icon: Lightbulb,
    label: "استشارة طبية",
    color: "text-primary",
    bgColor: "bg-[#00b2b3]/10",
  },
]

export default function Home() {
  const router = useRouter()
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    router.push(`/chat/new?q=${encodeURIComponent(input)}&autoSend=true`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-2 md:p-8 gap-8">
      <div className="w-full max-w-3xl space-y-8 mt-12">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <AnimatedLogo size="lg" />
          </div>
          <h2 className="text-2xl font-bold mt-8">كيف يمكنني المساعدة؟</h2>
          <p className="text-muted-foreground">تمكين الأنظمة الصحية من خلال حلول الذكاء الاصطناعي</p>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex flex-col relative item-center justify-end gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-4 py-4 pl-12 text-base sm:text-lg resize-none min-h-[100px]"
              placeholder="اسأل عن أي شيء..."
              rows={3}
            />
            <Button type="submit" className="w-max px-4 mx-2 left-0 absolute mb-3 mt-[-60px]" size="lg">
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {actionButtons.map((button, i) => (
            <Button
              key={i}
              variant="outline"
              className="h-auto py-2 px-3 hover:bg-accent/50 cursor-pointer group"
              onClick={() => router.push(`/chat/new?q=${encodeURIComponent(button.label)}&autoSend=false`)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-1 rounded-md transition-all group-hover:scale-105", button.bgColor)}>
                  <button.icon className={cn("h-3.5 w-3.5 text-[#00b2b3]")} />
                </div>
                <span className="text-xs">{button.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </main>
  )
}

