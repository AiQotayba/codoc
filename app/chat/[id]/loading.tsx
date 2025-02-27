import { Brain, Stethoscope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function Loading() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Animated Brain Icon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="animate-pulse">
                <Brain className="h-12 w-12 text-primary/20" />
              </div>
            </div>

            {/* Rotating Stethoscope */}
            <div className="relative">
              <div className="animate-spin [animation-duration:3s]">
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute left-1/2 top-1/2 h-full w-[2px] -translate-x-1/2 -translate-y-1/2 origin-center",
                        "before:absolute before:top-0 before:h-4 before:w-4 before:-translate-x-1/2 before:rounded-full before:bg-primary before:content-['']",
                        "after:absolute after:bottom-0 after:h-4 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-primary/20 after:content-['']",
                      )}
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 90}deg)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Messages */}
          <div className="mt-8 space-y-4">
            <Card className="mx-auto max-w-md bg-muted/50 p-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5">
                  <Stethoscope className="h-full w-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-32 animate-pulse rounded-full bg-primary/20" />
                  <div className="h-2 w-48 animate-pulse rounded-full bg-primary/10" />
                </div>
              </div>
            </Card>
          </div>

          <p className="mt-4 animate-pulse text-sm text-muted-foreground">جاري تحميل المحادثة...</p>
        </div>
      </div>

      {/* Fixed Disclaimer */}
      <p className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 p-2 text-center text-sm text-muted-foreground backdrop-blur-sm">
        يجب التحقق من المعلومات المهمة. لذلك يمكن أن تصدر عن نان بعض الأخطاء
      </p>
    </div>
  )
}

