import { AnimatedLogo } from "@/components/animated-logo"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="inline-block">
            <AnimatedLogo size="sm" />
          </Link>
          <Link href="/" className="md:hidden">
            <Button size="sm" className="h-8">
              <Plus className="ml-2 h-4 w-4" />
              محادثة جديدة
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

