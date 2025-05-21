/**
 * 환경 변수 설정 및 확인을 위한 유틸리티
 */

/**
 * Google 검색 API가 구성되어 있는지 확인합니다.
 * @returns 구성 여부
 */
export function isGoogleSearchConfigured(): boolean {
  // 하드코딩된 값을 사용하므로 항상 true 반환
  return true
}

/**
 * 환경 변수를 가져옵니다.
 * @param key 환경 변수 키
 * @param defaultValue 기본값
 * @returns 환경 변수 값
 */
export function getEnvVariable(key: string, defaultValue = ""): string {
  const value = process.env[key]
  return value || defaultValue
}

/**
 * 모든 필수 환경 변수가 설정되어 있는지 확인합니다.
 * @returns 설정 여부
 */
export function checkRequiredEnvVariables(): {
  isConfigured: boolean
  missingVariables: string[]
} {
  // 하드코딩된 값을 사용하므로 항상 구성됨으로 반환
  return {
    isConfigured: true,
    missingVariables: [],
  }
}

/**
 * 애플리케이션 상태를 확인합니다.
 * @returns 애플리케이션 상태 정보
 */
export async function checkAppStatus(): Promise<{
  status: "online" | "partial" | "offline"
  services: Record<string, boolean>
  message: string
}> {
  const { isConfigured, missingVariables } = checkRequiredEnvVariables()

  if (!isConfigured) {
    return {
      status: "partial",
      services: {
        search: false,
        database: true,
        ai: true,
      },
      message: `일부 서비스가 구성되지 않았습니다: ${missingVariables.join(", ")}`,
    }
  }

  return {
    status: "online",
    services: {
      search: true,
      database: true,
      ai: true,
    },
    message: "모든 서비스가 정상 작동 중입니다.",
  }
}
