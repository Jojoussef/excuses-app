import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function LoadingSpinner({ size = "default", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
}
