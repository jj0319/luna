"use client"
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getErrorInfo, getUserFriendlyErrorMessage } from "@/lib/errors/error-handler"

interface ErrorDisplayProps {
  error: unknown
  reset?: () => void
  showDetails?: boolean
  className?: string
}

export function ErrorDisplay({ error, reset, showDetails = false, className = "" }: ErrorDisplayProps) {
  const { code, details } = getErrorInfo(error)
  const userMessage = getUserFriendlyErrorMessage(error)

  // 심각도에 따른 아이콘 선택
  const SeverityIcon = () => {
    switch (details.severity) {
      case "critical":
        return <XCircle className="h-6 w-6 text-destructive" />
      case "error":
        return <AlertCircle className="h-6 w-6 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-warning" />
      default:
        return <Info className="h-6 w-6 text-info" />
    }
  }

  // 간단한 알림 형태
  if (!showDetails) {
    return (
      <Alert variant="destructive" className={className}>
        <SeverityIcon />
        <AlertTitle>오류 {code}</AlertTitle>
        <AlertDescription>{userMessage}</AlertDescription>
        {reset && (
          <Button variant="outline" size="sm" onClick={reset} className="mt-2">
            다시 시도
          </Button>
        )}
      </Alert>
    )
  }

  // 상세 정보가 포함된 카드 형태
  return (
    <Card
      className={`border-${details.severity === "critical" || details.severity === "error" ? "destructive" : details.severity} ${className}`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <SeverityIcon />
          <CardTitle>오류 {code}</CardTitle>
        </div>
        <CardDescription>{details.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>{details.description}</p>
          {details.suggestedAction && <p className="text-sm font-medium">제안된 조치: {details.suggestedAction}</p>}
        </div>
      </CardContent>
      {reset && (
        <CardFooter>
          <Button onClick={reset}>다시 시도</Button>
        </CardFooter>
      )}
    </Card>
  )
}

// 전역 오류 경계 컴포넌트
export function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorDisplay error={error} reset={reset} showDetails={true} />
      </div>
    </div>
  )
}
