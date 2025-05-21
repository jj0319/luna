"use client"

import type React from "react"
import type { ReactNode } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorDisplay } from "./error-display"

interface ErrorBoundaryWrapperProps {
  children: ReactNode
  fallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
  showDetails?: boolean
}

export function ErrorBoundaryWrapper({ children, fallbackComponent, showDetails = false }: ErrorBoundaryWrapperProps) {
  const DefaultFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <ErrorDisplay error={error} reset={resetErrorBoundary} showDetails={showDetails} />
  )

  return <ErrorBoundary FallbackComponent={fallbackComponent || DefaultFallback}>{children}</ErrorBoundary>
}
