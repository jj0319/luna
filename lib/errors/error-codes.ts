/**
 * Luna 오류 코드 시스템
 *
 * 애플리케이션 전체에서 사용되는 표준화된 오류 코드 정의
 */

// 오류 카테고리 (첫 번째 숫자로 표시)
// 1xxx: 시스템 오류
// 2xxx: 네트워크 오류
// 3xxx: 데이터베이스 오류
// 4xxx: 사용자 입력 오류
// 5xxx: 인증/권한 오류
// 6xxx: 외부 서비스 오류
// 7xxx: 리소스 오류
// 8xxx: 비즈니스 로직 오류
// 9xxx: 알 수 없는 오류

export interface ErrorDetails {
  code: number
  message: string
  description: string
  severity: "critical" | "error" | "warning" | "info"
  suggestedAction?: string
}

export const ErrorCodes: Record<string, ErrorDetails> = {
  // 시스템 오류 (1xxx)
  SYSTEM_GENERAL_ERROR: {
    code: 1000,
    message: "시스템 오류가 발생했습니다",
    description: "일반적인 시스템 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "애플리케이션을 재시작하거나 관리자에게 문의하세요",
  },
  SYSTEM_INITIALIZATION_FAILED: {
    code: 1001,
    message: "시스템 초기화 실패",
    description: "시스템 구성 요소를 초기화하는 중 오류가 발생했습니다",
    severity: "critical",
    suggestedAction: "로그를 확인하고 필요한 구성 요소가 모두 설치되어 있는지 확인하세요",
  },
  SYSTEM_RESOURCE_EXHAUSTED: {
    code: 1002,
    message: "시스템 리소스 부족",
    description: "메모리 또는 CPU와 같은 시스템 리소스가 부족합니다",
    severity: "error",
    suggestedAction: "다른 애플리케이션을 닫거나 시스템을 재시작하세요",
  },
  SYSTEM_FILE_NOT_FOUND: {
    code: 1003,
    message: "파일을 찾을 수 없음",
    description: "요청된 파일을 찾을 수 없습니다",
    severity: "error",
    suggestedAction: "파일 경로를 확인하고 파일이 존재하는지 확인하세요",
  },
  SYSTEM_FILE_ACCESS_DENIED: {
    code: 1004,
    message: "파일 접근 거부",
    description: "파일에 접근할 권한이 없습니다",
    severity: "error",
    suggestedAction: "파일 권한을 확인하거나 관리자 권한으로 실행하세요",
  },

  // 네트워크 오류 (2xxx)
  NETWORK_GENERAL_ERROR: {
    code: 2000,
    message: "네트워크 오류",
    description: "일반적인 네트워크 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "네트워크 연결을 확인하고 다시 시도하세요",
  },
  NETWORK_CONNECTION_FAILED: {
    code: 2001,
    message: "네트워크 연결 실패",
    description: "서버에 연결할 수 없습니다",
    severity: "error",
    suggestedAction: "인터넷 연결을 확인하고 다시 시도하세요",
  },
  NETWORK_TIMEOUT: {
    code: 2002,
    message: "네트워크 시간 초과",
    description: "서버 응답 대기 시간이 초과되었습니다",
    severity: "error",
    suggestedAction: "나중에 다시 시도하거나 네트워크 상태를 확인하세요",
  },
  NETWORK_API_ERROR: {
    code: 2003,
    message: "API 오류",
    description: "API 호출 중 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "API 매개변수를 확인하고 다시 시도하세요",
  },

  // 데이터베이스 오류 (3xxx)
  DATABASE_GENERAL_ERROR: {
    code: 3000,
    message: "데이터베이스 오류",
    description: "일반적인 데이터베이스 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "데이터베이스 연결을 확인하고 다시 시도하세요",
  },
  DATABASE_CONNECTION_FAILED: {
    code: 3001,
    message: "데이터베이스 연결 실패",
    description: "데이터베이스에 연결할 수 없습니다",
    severity: "critical",
    suggestedAction: "데이터베이스 서버가 실행 중인지 확인하세요",
  },
  DATABASE_QUERY_FAILED: {
    code: 3002,
    message: "데이터베이스 쿼리 실패",
    description: "데이터베이스 쿼리 실행 중 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "쿼리 구문을 확인하고 다시 시도하세요",
  },
  DATABASE_RECORD_NOT_FOUND: {
    code: 3003,
    message: "레코드를 찾을 수 없음",
    description: "요청된 데이터베이스 레코드를 찾을 수 없습니다",
    severity: "warning",
    suggestedAction: "검색 조건을 확인하고 다시 시도하세요",
  },

  // 사용자 입력 오류 (4xxx)
  USER_INPUT_GENERAL_ERROR: {
    code: 4000,
    message: "입력 오류",
    description: "일반적인 사용자 입력 오류가 발생했습니다",
    severity: "warning",
    suggestedAction: "입력을 확인하고 다시 시도하세요",
  },
  USER_INPUT_VALIDATION_FAILED: {
    code: 4001,
    message: "입력 유효성 검사 실패",
    description: "입력된 데이터가 유효하지 않습니다",
    severity: "warning",
    suggestedAction: "입력 형식을 확인하고 다시 시도하세요",
  },
  USER_INPUT_REQUIRED_FIELD_MISSING: {
    code: 4002,
    message: "필수 필드 누락",
    description: "하나 이상의 필수 필드가 누락되었습니다",
    severity: "warning",
    suggestedAction: "모든 필수 필드를 입력하세요",
  },

  // 인증/권한 오류 (5xxx)
  AUTH_GENERAL_ERROR: {
    code: 5000,
    message: "인증 오류",
    description: "일반적인 인증 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "자격 증명을 확인하고 다시 시도하세요",
  },
  AUTH_INVALID_CREDENTIALS: {
    code: 5001,
    message: "잘못된 자격 증명",
    description: "제공된 사용자 이름 또는 비밀번호가 잘못되었습니다",
    severity: "warning",
    suggestedAction: "사용자 이름과 비밀번호를 확인하고 다시 시도하세요",
  },
  AUTH_SESSION_EXPIRED: {
    code: 5002,
    message: "세션 만료",
    description: "사용자 세션이 만료되었습니다",
    severity: "warning",
    suggestedAction: "다시 로그인하세요",
  },
  AUTH_PERMISSION_DENIED: {
    code: 5003,
    message: "권한 거부",
    description: "요청된 작업을 수행할 권한이 없습니다",
    severity: "warning",
    suggestedAction: "필요한 권한이 있는지 확인하거나 관리자에게 문의하세요",
  },

  // 외부 서비스 오류 (6xxx)
  EXTERNAL_SERVICE_GENERAL_ERROR: {
    code: 6000,
    message: "외부 서비스 오류",
    description: "일반적인 외부 서비스 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "나중에 다시 시도하거나 서비스 상태를 확인하세요",
  },
  EXTERNAL_SERVICE_UNAVAILABLE: {
    code: 6001,
    message: "외부 서비스를 사용할 수 없음",
    description: "외부 서비스에 연결할 수 없습니다",
    severity: "error",
    suggestedAction: "서비스 상태를 확인하고 나중에 다시 시도하세요",
  },
  EXTERNAL_SERVICE_TIMEOUT: {
    code: 6002,
    message: "외부 서비스 시간 초과",
    description: "외부 서비스 응답 대기 시간이 초과되었습니다",
    severity: "error",
    suggestedAction: "나중에 다시 시도하세요",
  },
  EXTERNAL_SERVICE_RATE_LIMIT: {
    code: 6003,
    message: "외부 서비스 속도 제한",
    description: "외부 서비스 속도 제한에 도달했습니다",
    severity: "warning",
    suggestedAction: "잠시 후 다시 시도하세요",
  },

  // 리소스 오류 (7xxx)
  RESOURCE_GENERAL_ERROR: {
    code: 7000,
    message: "리소스 오류",
    description: "일반적인 리소스 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "시스템 리소스를 확인하고 다시 시도하세요",
  },
  RESOURCE_NOT_FOUND: {
    code: 7001,
    message: "리소스를 찾을 수 없음",
    description: "요청된 리소스를 찾을 수 없습니다",
    severity: "error",
    suggestedAction: "리소스 경로를 확인하고 다시 시도하세요",
  },
  RESOURCE_ALREADY_EXISTS: {
    code: 7002,
    message: "리소스가 이미 존재함",
    description: "동일한 이름의 리소스가 이미 존재합니다",
    severity: "warning",
    suggestedAction: "다른 이름을 사용하거나 기존 리소스를 업데이트하세요",
  },

  // 비즈니스 로직 오류 (8xxx)
  BUSINESS_LOGIC_GENERAL_ERROR: {
    code: 8000,
    message: "비즈니스 로직 오류",
    description: "일반적인 비즈니스 로직 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "입력 데이터를 확인하고 다시 시도하세요",
  },
  BUSINESS_LOGIC_VALIDATION_FAILED: {
    code: 8001,
    message: "비즈니스 규칙 유효성 검사 실패",
    description: "비즈니스 규칙 유효성 검사에 실패했습니다",
    severity: "warning",
    suggestedAction: "입력 데이터가 비즈니스 규칙을 준수하는지 확인하세요",
  },

  // 알 수 없는 오류 (9xxx)
  UNKNOWN_ERROR: {
    code: 9000,
    message: "알 수 없는 오류",
    description: "알 수 없는 오류가 발생했습니다",
    severity: "error",
    suggestedAction: "관리자에게 문의하세요",
  },
}

// 오류 코드로 오류 세부 정보 가져오기
export function getErrorDetails(code: number): ErrorDetails | undefined {
  for (const key in ErrorCodes) {
    if (ErrorCodes[key].code === code) {
      return ErrorCodes[key]
    }
  }
  return undefined
}

// 오류 코드 이름으로 오류 세부 정보 가져오기
export function getErrorDetailsByName(name: string): ErrorDetails | undefined {
  return ErrorCodes[name]
}
