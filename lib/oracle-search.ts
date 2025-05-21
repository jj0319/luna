/**
 * ORACLE 검색 모듈
 *
 * Google 검색 API를 활용하여 실시간 정보 검색 기능 제공
 */

import { googleSearch } from "@/lib/google-search"

// 검색 결과 인터페이스
export interface SearchResult {
  title: string
  link: string
  snippet: string
  source: string
  timestamp: number
}

// 검색 옵션 인터페이스
export interface SearchOptions {
  limit?: number
  safeSearch?: boolean
  language?: string
  region?: string
  includeMetadata?: boolean
}

export class OracleSearch {
  private initialized = false
  private searchHistory: Array<{
    query: string
    timestamp: number
    resultCount: number
  }> = []

  constructor() {}

  /**
   * 검색 모듈 초기화
   */
  async initialize(): Promise<void> {
    try {
      // Google API 키와 검색 엔진 ID 확인
      if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_ID) {
        throw new Error("Google API 키 또는 검색 엔진 ID가 설정되지 않았습니다.")
      }

      this.initialized = true
      console.log("ORACLE 검색 모듈 초기화 완료")
    } catch (error) {
      console.error("ORACLE 검색 모듈 초기화 오류:", error)
      throw error
    }
  }

  /**
   * 검색 수행
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    if (!this.initialized) {
      throw new Error("ORACLE 검색 모듈이 초기화되지 않았습니다.")
    }

    try {
      // 검색 옵션 설정
      const searchOptions = {
        limit: options.limit || 5,
        safeSearch: options.safeSearch !== false,
        language: options.language || "ko",
        region: options.region || "kr",
      }

      // Google 검색 실행
      const results = await googleSearch(query, searchOptions)

      // 검색 결과 변환
      const searchResults: SearchResult[] = results.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        source: "google",
        timestamp: Date.now(),
      }))

      // 검색 기록 추가
      this.searchHistory.push({
        query,
        timestamp: Date.now(),
        resultCount: searchResults.length,
      })

      return searchResults
    } catch (error) {
      console.error("검색 오류:", error)
      throw error
    }
  }

  /**
   * 검색 결과 요약
   */
  async summarizeResults(results: SearchResult[]): Promise<string> {
    if (results.length === 0) {
      return "검색 결과가 없습니다."
    }

    // 간단한 요약 생성
    const summary =
      `${results.length}개의 검색 결과를 찾았습니다. 주요 내용:\n\n` +
      results
        .map((result, index) => `${index + 1}. ${result.title}\n${result.snippet}\n출처: ${result.link}`)
        .join("\n\n")

    return summary
  }

  /**
   * 검색 결과에서 정보 추출
   */
  extractInformation(results: SearchResult[], query: string): Record<string, any> {
    // 검색 결과에서 관련 정보 추출
    const information: Record<string, any> = {
      query,
      timestamp: Date.now(),
      sources: results.map((r) => r.link),
      keyPoints: [],
    }

    // 주요 포인트 추출 (간단한 구현)
    for (const result of results) {
      const sentences = result.snippet.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(query.toLowerCase())) {
          information.keyPoints.push(sentence.trim())
        }
      }
    }

    return information
  }

  /**
   * 검색 기록 가져오기
   */
  getSearchHistory(): Array<{
    query: string
    timestamp: number
    resultCount: number
  }> {
    return [...this.searchHistory]
  }

  /**
   * 검색 모듈이 초기화되었는지 확인
   */
  isInitialized(): boolean {
    return this.initialized
  }
}

// 싱글톤 인스턴스 생성
export const oracleSearch = new OracleSearch()
