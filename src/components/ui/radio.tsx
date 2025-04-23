
import * as React from "react"
import { cn } from "@/lib/utils"

const Radio = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      type="radio"
      className={cn(
        "h-4 w-4 rounded-full border border-gray-300 text-votePurple focus:ring-votePurple",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Radio.displayName = "Radio"

export { Radio }
