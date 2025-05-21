import { NextResponse } from "next/server"
import { ErrorCodes } from "./error-codes"
import { LunaError, handleError, logError } from "./error-handler"

/**
 * API 오류 응답 생성
 */
export function createErrorResponse(error: unknown, status = 500) {
  const lunaError = error instanceof LunaError ? error : handleError(error)

  // 오류 로깅
  logError(lunaError, { isApiRequest: true })

  // 상태 코드 결정
  let statusCode = status
  if (lunaError.code >= 4000 && lunaError.code < 5000) {
    statusCode = 400 // 사용자 입력 오류
  } else if (lunaError.code >= 5000 && lunaError.code < 6000) {
    statusCode = 401 // 인증 오류
  } else if (lunaError.code === ErrorCodes.AUTH_PERMISSION_DENIED.code) {
    statusCode = 403 // 권한 오류
  } else if (lunaError.code === ErrorCodes.RESOURCE_NOT_FOUND.code) {
    statusCode = 404 // 리소스 없음
  }

  return NextResponse.json(
    {
      error: {
        code: lunaError.code,
        message: lunaError.details.message,
        description: lunaError.details.description,
        severity: lunaError.details.severity,
        suggestedAction: lunaError.details.suggestedAction,
      },
    },
    { status: statusCode },
  )
}

/**
 * API 라우트 핸들러 래핑
 */
export function withApiErrorHandling(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}
