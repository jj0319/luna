/**
 * 검색 관련 유틸리티 함수
 */

import type { SearchResult } from "./google-search"

/**
 * 검색 결과에서 중요한 정보를 추출합니다.
 * @param results 검색 결과 배열
 * @returns 추출된 정보
 */
export function extractKeyInformation(results: SearchResult[]) {
  return results.map((result) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet,
    hasImage: !!result.pagemap?.cse_image?.[0]?.src,
  }))
}

/**
 * 텍스트에서 검색어를 강조합니다.
 * @param text 원본 텍스트
 * @param query 검색어
 * @returns 강조된 텍스트 (HTML 마크업 포함)
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text

  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 2)

  if (terms.length === 0) return text

  let result = text

  terms.forEach((term) => {
    const regex = new RegExp(`(${term})`, "gi")
    result = result.replace(regex, "<mark>$1</mark>")
  })

  return result
}

/**
 * 검색 결과를 관련성에 따라 정렬합니다.
 * @param results 검색 결과 배열
 * @param query 검색어
 * @returns 정렬된 검색 결과
 */
export function sortResultsByRelevance(results: SearchResult[], query: string): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/)

  return [...results].sort((a, b) => {
    const aScore = calculateRelevanceScore(a, terms)
    const bScore = calculateRelevanceScore(b, terms)
    return bScore - aScore
  })
}

/**
 * 검색 결과의 관련성 점수를 계산합니다.
 * @param result 검색 결과
 * @param terms 검색어 단어 배열
 * @returns 관련성 점수
 */
function calculateRelevanceScore(result: SearchResult, terms: string[]): number {
  let score = 0
  const title = result.title.toLowerCase()
  const snippet = result.snippet.toLowerCase()

  // 제목에 검색어가 포함된 경우 가중치 부여
  terms.forEach((term) => {
    if (title.includes(term)) score += 3
    if (snippet.includes(term)) score += 1
  })

  // 이미지가 있는 경우 가중치 부여
  if (result.pagemap?.cse_image?.[0]?.src) {
    score += 1
  }

  return score
}
