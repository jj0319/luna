import type { NextRequest } from "next/server"
import { performGoogleSearch, performMockSearch, isGoogleSearchConfigured } from "@/lib/google-search"
import { withApiErrorHandling } from "@/lib/errors/api-error-handler"
import { LunaError } from "@/lib/errors/error-handler"

async function handler(request: NextRequest) {
  // Get query from URL parameters
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    throw new LunaError("USER_INPUT_REQUIRED_FIELD_MISSING", undefined, "검색어가 제공되지 않았습니다")
  }

  // Check if we should use mock data
  const useMock = searchParams.get("mock") === "true" || !isGoogleSearchConfigured()

  // Perform search
  try {
    const searchResults = useMock ? await performMockSearch(query) : await performGoogleSearch(query)
    return Response.json(searchResults)
  } catch (error) {
    // 오류 유형에 따라 적절한 오류 코드 선택
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new LunaError("EXTERNAL_SERVICE_GENERAL_ERROR", error, "Google API 키 오류")
      } else if (error.message.includes("network")) {
        throw new LunaError("NETWORK_CONNECTION_FAILED", error)
      } else if (error.message.includes("timeout")) {
        throw new LunaError("NETWORK_TIMEOUT", error)
      }
    }

    // 기본 오류 처리
    throw new LunaError(
      "EXTERNAL_SERVICE_GENERAL_ERROR",
      error instanceof Error ? error : undefined,
      "검색 처리 중 오류가 발생했습니다",
    )
  }
}

export const GET = withApiErrorHandling(handler)
