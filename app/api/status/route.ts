import { NextResponse } from "next/server"

/**
 * 애플리케이션 상태 확인 API 엔드포인트
 * 로컬 환경에서는 항상 온라인 상태를 반환합니다.
 */
export async function GET() {
  // 로컬 환경에서는 항상 온라인 상태로 간주
  const status = {
    status: "online",
    services: {
      search: true,
      database: true,
      ai: true,
    },
    environment: "local",
    message: "로컬 환경에서 실행 중입니다. 모든 기능이 오프라인으로 작동합니다.",
  }

  return NextResponse.json(status)
}
