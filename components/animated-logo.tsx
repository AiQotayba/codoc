"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

interface AnimatedLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function AnimatedLogo({ className, size = "md" }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-3 select-none",
        "transform transition-all duration-500",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Mark */}
      <div className={cn("relative", sizeClasses[size])}>
        <div
          className={cn(
            "aspect-square h-full",
            "transform transition-all duration-500 ease-out",
            isHovered ? "scale-110" : "scale-100",
          )}
        >
          <svg
            viewBox="0 0 179.04 182.52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-full w-full transition-all duration-500", isHovered ? "rotate-[360deg]" : "rotate-0")}
          >
            <path
              className={cn("fill-primary transition-all duration-500", isHovered ? "opacity-90" : "opacity-100")}
              d="M137.91,179.26c-.37,1.23-4.01,2.62-5.48,2.52-27.19-1.79-57.23,2.31-84.06.02-2.16-.18-6.46-.61-6.46-3.54v-37.5H4.41c-.61,0-4.18-3.98-3.55-5.45,2.2-27.87-2.73-59.74,0-87.11.18-1.85,1.64-6.44,3.56-6.44h37.5V4.26c0-2.93,4.3-3.36,6.46-3.54,27.17-2.32,57.57,1.86,85.09,0,1.27-.39,4.45,1.74,4.45,2.55v37c0,.11,1.39,1.5,1.5,1.5h36c.28,0,2.42,2.41,2.98,3.02l.57,90.53c.7,1.97-3.34,5.45-4.55,5.45h-35c-.11,0-1.5,1.39-1.5,1.5v37ZM83.91,14.76c-5.49-.13-11.04.17-16.54.04-2.27-.05-12.46-2.8-12.46,1.46v35c0,2.17-4.47,4.51-6.64,4.45l-34.36.05v27.5c0,.11,1.39,1.5,1.5,1.5h28.5c2.98-15.43,10.95-28.25,25.32-35.18,2.74-1.32,14.68-4.64,14.68-6.32V14.76ZM165.91,84.76v-28.5c0-1.1-2.44-1.43-3.45-1.55-7.96-.93-30.78,2.98-35.48-.52-.57-.42-2.07-2.5-2.07-2.93V15.26c0-1.1-2.44-1.43-3.45-1.55-7.87-.92-16.67.89-24.55,1.05v29.5c7.45,3.13,14.88,4.42,21.5,9.5,10.51,8.07,14.51,19.07,19,31h28.5ZM87.7,58.06c-44.61,3.67-39.22,71.13,6.7,66.69,42.12-4.07,36.33-70.23-6.7-66.69ZM42.41,97.76H15.41c-.11,0-1.5,1.39-1.5,1.5v27c0,.11,1.39,1.5,1.5,1.5h36c1.04,0,3.5,2.46,3.5,3.5v36c0,.11,1.39,1.5,1.5,1.5h26.5c-.57-10.24.95-20.75-.2-30.79-13.25-3.23-24.2-9.08-31.6-20.9-3.96-6.34-4.94-13.12-8.7-19.3ZM165.91,97.76h-28.5c-3.16,5.54-3.8,11.25-6.98,17.02-6.79,12.3-19.53,21.05-33.52,22.98v31h28v-36.5c0-.52,3.09-4.5,3.5-4.5h37.5v-30Z"
            />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div
        className={cn(
          "font-bold tracking-wider text-primary transition-all duration-500",
          isHovered ? "opacity-90" : "opacity-100",
          size === "sm" && "text-xl",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl",
        )}
      >
        CODOC
      </div>
    </div>
  )
}

