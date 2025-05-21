/**
 * Luna 오류 처리 유틸리티
 *
 * 애플리케이션 전체에서 일관된 오류 처리를 위한 유틸리티 함수
 */

import { ErrorCodes, type ErrorDetails, getErrorDetails } from "./error-codes"

export class LunaError extends Error {
  code: number
  details: ErrorDetails
  originalError?: Error

  constructor(errorCode: number | keyof typeof ErrorCodes, originalError?: Error, additionalInfo?: string) {
    let details: ErrorDetails

    if (typeof errorCode === "number") {
      details = getErrorDetails(errorCode) || ErrorCodes.UNKNOWN_ERROR
    } else {
      details = ErrorCodes[errorCode] || ErrorCodes.UNKNOWN_ERROR
    }

    const message = additionalInfo ? `${details.message}: ${additionalInfo}` : details.message

    super(message)

    this.name = "LunaError"
    this.code = details.code
    this.details = details
    this.originalError = originalError

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LunaError)
    }
  }
}

/**
 * 오류를 LunaError로 변환
 */
export function handleError(error: unknown, defaultErrorCode: keyof typeof ErrorCodes = "UNKNOWN_ERROR"): LunaError {
  if (error instanceof LunaError) {
    return error
  }

  let originalError: Error
  let additionalInfo: string | undefined

  if (error instanceof Error) {
    originalError = error
    additionalInfo = error.message
  } else if (typeof error === "string") {
    originalError = new Error(error)
    additionalInfo = error
  } else {
    originalError = new Error("Unknown error")
    try {
      additionalInfo = JSON.stringify(error)
    } catch {
      additionalInfo = "Non-serializable error"
    }
  }

  return new LunaError(defaultErrorCode, originalError, additionalInfo)
}

/**
 * 오류 로깅
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const lunaError = error instanceof LunaError ? error : handleError(error)

  const logData = {
    timestamp: new Date().toISOString(),
    errorCode: lunaError.code,
    errorName: Object.keys(ErrorCodes).find((key) => ErrorCodes[key].code === lunaError.code) || "UNKNOWN_ERROR",
    message: lunaError.message,
    severity: lunaError.details.severity,
    stack: lunaError.stack,
    originalError: lunaError.originalError
      ? {
          name: lunaError.originalError.name,
          message: lunaError.originalError.message,
          stack: lunaError.originalError.stack,
        }
      : undefined,
    context,
  }

  // 심각도에 따라 다른 로깅 레벨 사용
  switch (lunaError.details.severity) {
    case "critical":
      console.error("CRITICAL ERROR:", logData)
      // 여기에 외부 로깅 서비스로 전송하는 코드 추가 가능
      break
    case "error":
      console.error("ERROR:", logData)
      break
    case "warning":
      console.warn("WARNING:", logData)
      break
    case "info":
      console.info("INFO:", logData)
      break
    default:
      console.log("LOG:", logData)
  }
}

/**
 * 사용자에게 표시할 오류 메시지 생성
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const lunaError = error instanceof LunaError ? error : handleError(error)

  return `${lunaError.details.message}${lunaError.details.suggestedAction ? ` ${lunaError.details.suggestedAction}` : ""}`
}

/**
 * 오류 코드 및 세부 정보 가져오기
 */
export function getErrorInfo(error: unknown): { code: number; details: ErrorDetails } {
  const lunaError = error instanceof LunaError ? error : handleError(error)

  return {
    code: lunaError.code,
    details: lunaError.details,
  }
}

/**
 * 비동기 함수 래핑하여 오류 처리
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  defaultErrorCode: keyof typeof ErrorCodes = "UNKNOWN_ERROR",
  context?: Record<string, any>,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const lunaError = handleError(error, defaultErrorCode)
    logError(lunaError, context)
    throw lunaError
  }
}

/**
 * 동기 함수 래핑하여 오류 처리
 */
export function withSyncErrorHandling<T>(
  fn: () => T,
  defaultErrorCode: keyof typeof ErrorCodes = "UNKNOWN_ERROR",
  context?: Record<string, any>,
): T {
  try {
    return fn()
  } catch (error) {
    const lunaError = handleError(error, defaultErrorCode)
    logError(lunaError, context)
    throw lunaError
  }
}
