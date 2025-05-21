import { NextResponse } from "next/server"

/**
 * 환경 변수 확인 API 엔드포인트
 * 로컬 환경에서는 항상 성공 상태를 반환합니다.
 */
export async function GET() {
  // 로컬 환경에서는 항상 구성된 것으로 간주
  const { isConfigured, missingVariables } = {
    isConfigured: true,
    missingVariables: [],
  }

  return NextResponse.json({
    isConfigured,
    missingVariables,
    environment: "local",
    message: "로컬 환경에서 실행 중입니다. 모든 기능이 오프라인으로 작동합니다.",
  })
}
