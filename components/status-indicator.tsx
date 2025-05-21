"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertCircle, WifiOff } from "lucide-react"

export default function StatusIndicator() {
  const [status, setStatus] = useState<"online" | "partial" | "offline">("online")
  const [message, setMessage] = useState<string>("로컬 환경에서 실행 중입니다")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬 환경에서는 항상 온라인 상태로 간주
    setStatus("online")
    setMessage("로컬 환경에서 실행 중입니다. 모든 기능이 오프라인으로 작동합니다.")
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        상태 확인 중...
      </Badge>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={status === "online" ? "default" : status === "partial" ? "outline" : "destructive"}
            className="cursor-help"
          >
            {status === "online" ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> 온라인
              </>
            ) : status === "partial" ? (
              <>
                <AlertCircle className="h-3 w-3 mr-1" /> 일부 기능 제한
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" /> 오프라인
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
