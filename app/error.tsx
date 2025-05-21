"use client"

import { useEffect } from "react"
import { GlobalErrorBoundary } from "@/components/errors/error-display"
import { logError } from "@/lib/errors/error-handler"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // 오류 로깅
    logError(error, { source: "global_error_page" })
  }, [error])

  return <GlobalErrorBoundary error={error} reset={reset} />
}
