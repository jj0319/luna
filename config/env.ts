/**
 * Luna 애플리케이션 환경 변수 및 설정
 * 모든 환경 변수는 이 파일에서 중앙 관리됩니다.
 */

// 애플리케이션 기본 정보
export const APP_INFO = {
  NAME: "Luna",
  VERSION: "1.0.0",
  DESCRIPTION: "개인용 AI 연구 및 검색 플랫폼",
  AUTHOR: "Luna User",
  COPYRIGHT: `Copyright © ${new Date().getFullYear()}`,
  WEBSITE: "https://luna-ai.app",
  SUPPORT_EMAIL: "support@luna-ai.app",
}

// 환경 변수
export const ENV = {
  // Google API 설정 - 실제 API 키와 ID로 업데이트
  GOOGLE_API_KEY: "AIzaSyAiFX1mcpCnMgsHqHvp8NJOAGU7ZN4yVDs",
  GOOGLE_ID: "f4db37719b0144276",

  // 애플리케이션 설정
  APP_PORT: "3000",
  APP_URL: "http://localhost:3000",

  // 로컬 스토리지 키
  STORAGE_KEYS: {
    THEME: "luna-theme",
    HISTORY: "luna-history",
    FAVORITES: "luna-favorites",
    SETTINGS: "luna-settings",
    CHAT_HISTORY: "luna-chat-history",
    SEARCH_HISTORY: "luna-search-history",
  },

  // 윈도우 설정
  WINDOW: {
    WIDTH: 1200,
    HEIGHT: 800,
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600,
    TITLE: "Luna - 개인용 AI 어시스턴트",
    ICON: "public/icons/icon-512x512.png",
  },

  // 기본 설정
  DEFAULT_SETTINGS: {
    THEME: "light", // light 또는 dark
    LANGUAGE: "ko", // ko 또는 en
    AUTO_SAVE: true,
    NOTIFICATIONS: true,
    SEARCH_ENGINE: "google",
    MAX_HISTORY: 100,
    CHAT_MODEL: "gpt2Medium", // 기본 채팅 모델
  },
}

/**
 * 환경 변수 가져오기
 * @param key 환경 변수 키
 * @param defaultValue 기본값 (선택사항)
 * @returns 환경 변수 값 또는 기본값
 */
export function getEnv(key: string, defaultValue = ""): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] || defaultValue
  }

  // ENV 객체에서 직접 가져오기
  return (ENV as any)[key] || defaultValue
}

/**
 * 로컬 스토리지 키 가져오기
 * @param key 스토리지 키 이름
 * @returns 전체 스토리지 키
 */
export function getStorageKey(key: keyof typeof ENV.STORAGE_KEYS): string {
  return ENV.STORAGE_KEYS[key]
}

// 개발 환경 여부 확인
export const isDev = process.env.NODE_ENV === "development"
