/**
 * 검색 트리거 관련 유틸리티 함수
 */

/**
 * 사용자 입력이 검색을 트리거해야 하는지 확인합니다.
 * @param input 사용자 입력
 * @returns 검색 트리거 여부
 */
export function shouldTriggerSearch(input: string): boolean {
  // 입력이 비어있거나 너무 짧은 경우
  if (!input || input.trim().length < 3) return false

  // 질문 형태인 경우
  if (isQuestion(input)) return true

  // 검색어 형태인 경우
  if (isSearchQuery(input)) return true

  return false
}

/**
 * 입력이 질문 형태인지 확인합니다.
 * @param input 사용자 입력
 * @returns 질문 여부
 */
export function isQuestion(input: string): boolean {
  const trimmed = input.trim()

  // 물음표로 끝나는 경우
  if (trimmed.endsWith("?") || trimmed.endsWith("？")) return true

  // 의문사로 시작하는 경우 (한국어)
  const koreanQuestionWords = ["무엇", "어떻게", "왜", "언제", "어디", "누구", "얼마나", "몇"]
  for (const word of koreanQuestionWords) {
    if (trimmed.startsWith(word)) return true
  }

  // 의문사로 시작하는 경우 (영어)
  const englishQuestionWords = ["what", "how", "why", "when", "where", "who", "which", "whose", "whom"]
  const lowerInput = trimmed.toLowerCase()
  for (const word of englishQuestionWords) {
    if (lowerInput.startsWith(word)) return true
  }

  return false
}

/**
 * 입력이 검색어 형태인지 확인합니다.
 * @param input 사용자 입력
 * @returns 검색어 여부
 */
export function isSearchQuery(input: string): boolean {
  const trimmed = input.trim()

  // 키워드 나열 형태인 경우
  if (trimmed.split(/\s+/).length <= 5 && trimmed.length < 30) return true

  // 특정 키워드를 포함하는 경우
  const searchKeywords = ["검색", "찾아", "알려줘", "search", "find", "look up"]
  const lowerInput = trimmed.toLowerCase()
  for (const keyword of searchKeywords) {
    if (lowerInput.includes(keyword)) return true
  }

  return false
}

/**
 * 사용자 입력에서 최적화된 검색어를 생성합니다.
 * @param input 사용자 입력
 * @returns 최적화된 검색어
 */
export function generateOptimizedQuery(input: string): string {
  let query = input.trim()

  // 물음표 제거
  query = query.replace(/\?|？/g, "")

  // 불필요한 단어 제거
  const unnecessaryWords = ["검색", "찾아", "알려줘", "search", "find", "look up", "please", "해줘"]
  for (const word of unnecessaryWords) {
    query = query.replace(new RegExp(`\\b${word}\\b`, "gi"), "")
  }

  // 의문사 제거 (한국어)
  const koreanQuestionWords = ["무엇", "어떻게", "왜", "언제", "어디", "누구", "얼마나", "몇"]
  for (const word of koreanQuestionWords) {
    if (query.startsWith(word)) {
      query = query.substring(word.length).trim()
    }
  }

  // 의문사 제거 (영어)
  const englishQuestionWords = ["what", "how", "why", "when", "where", "who", "which", "whose", "whom"]
  const lowerQuery = query.toLowerCase()
  for (const word of englishQuestionWords) {
    if (lowerQuery.startsWith(word)) {
      query = query.substring(word.length).trim()
    }
  }

  // 불필요한 공백 제거
  query = query.replace(/\s+/g, " ").trim()

  return query
}
