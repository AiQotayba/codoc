import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "./providers"

import { SiteHeader } from "@/components/site-header"
import { ChatSidebar } from "@/components/chat-sidebar"

const tajawal = localFont({
  src: [
    {
      path: "./fonts/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: "CODOC - المساعد الطبي الذكي",
  description: "تمكين الأنظمة الصحية من خلال حلول الذكاء الاصطناعي",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cn("min-h-screen bg-background font-sans antialiased", tajawal.variable, "font-tajawal")}>
        <Providers>
          <div className="flex h-screen flex-col bg-background">
            <SiteHeader />
            <div className="flex flex-1 overflow-hidden">
              <ChatSidebar />
              <main className="flex-1 md:mr-[300px]">{children}</main>

              <p className="fixed md:mr-[300px] bottom-0 left-0 right-0 p-2 text-sm text-center text-muted-foreground bg-background/80 backdrop-blur-sm z-10">
                يجب التحقق من المعلومات المهمة. لذلك يمكن أن تصدر عن CODOC بعض الأخطاء
              </p>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}

