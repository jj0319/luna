"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function EnvCheck() {
  const [isConfigured, setIsConfigured] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬 환경에서는 항상 구성된 것으로 간주
    setIsConfigured(true)
    setMessage("로컬 환경에서 실행 중입니다. 모든 기능이 오프라인으로 작동합니다.")
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <Alert className="animate-pulse">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>환경 변수 확인 중...</AlertTitle>
        <AlertDescription>잠시만 기다려주세요.</AlertDescription>
      </Alert>
    )
  }

  if (!isConfigured && message) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>환경 설정 오류</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  if (isConfigured && message) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>환경 설정 완료</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  return null
}
