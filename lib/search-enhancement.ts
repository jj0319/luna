/**
 * Enhanced Search System
 *
 * 고급 검색 기능을 제공합니다.
 */

import { performGoogleSearch, performMockSearch, isGoogleSearchConfigured } from "@/lib/google-search"

export interface SearchFilters {
  dateRange?: {
    start?: Date
    end?: Date
  }
  siteRestriction?: string
  fileType?: string
  language?: string
  safeSearch?: boolean
  excludeTerms?: string[]
}

export interface EnhancedSearchOptions extends SearchFilters {
  maxResults?: number
  page?: number
  includeRelatedQueries?: boolean
  includeFeaturedSnippet?: boolean
  includeImages?: boolean
}

export interface EnhancedSearchResult {
  title: string
  url: string
  snippet: string
  source: string
  date?: string
  imageUrl?: string
  fileType?: string
  isRelated?: boolean
  isFeatured?: boolean
  relevanceScore?: number
}

export interface EnhancedSearchResponse {
  query: string
  results: EnhancedSearchResult[]
  relatedQueries?: string[]
  featuredSnippet?: {
    title: string
    content: string
    source: string
    url: string
  }
  totalResults: number
  searchTime: number
  page: number
  hasMoreResults: boolean
  filters: SearchFilters
}

export class EnhancedSearch {
  private searchHistory: {
    query: string
    timestamp: number
    resultCount: number
  }[] = []

  private recentQueries: Set<string> = new Set()
  private maxHistorySize = 100

  constructor() {
    this.loadHistory()
  }

  /**
   * 검색 수행
   */
  public async search(query: string, options: EnhancedSearchOptions = {}): Promise<EnhancedSearchResponse> {
    if (!query.trim()) {
      throw new Error("검색어가 비어있습니다.")
    }

    // 검색 쿼리 기록
    this.recordQuery(query)

    // 검색 필터 적용
    const enhancedQuery = this.applyFiltersToQuery(query, options)

    try {
      // Google 검색 API 사용 가능 여부 확인
      const useGoogleSearch = isGoogleSearchConfigured()

      // 검색 수행
      const searchResponse = useGoogleSearch
        ? await performGoogleSearch(enhancedQuery, {
            num: options.maxResults || 10,
            start: ((options.page || 1) - 1) * (options.maxResults || 10) + 1,
          })
        : await performMockSearch(enhancedQuery)

      // 검색 결과 변환
      const results = this.transformSearchResults(searchResponse.items, options)

      // 관련 쿼리 생성
      const relatedQueries = options.includeRelatedQueries ? this.generateRelatedQueries(query) : undefined

      // 주요 발췌 생성
      const featuredSnippet =
        options.includeFeaturedSnippet && results.length > 0
          ? this.generateFeaturedSnippet(query, results[0])
          : undefined

      // 검색 기록 업데이트
      this.updateSearchHistory(query, results.length)

      // 응답 생성
      const response: EnhancedSearchResponse = {
        query,
        results,
        relatedQueries,
        featuredSnippet,
        totalResults: Number.parseInt(searchResponse.searchInformation.totalResults),
        searchTime: searchResponse.searchInformation.searchTime,
        page: options.page || 1,
        hasMoreResults: results.length === (options.maxResults || 10),
        filters: {
          dateRange: options.dateRange,
          siteRestriction: options.siteRestriction,
          fileType: options.fileType,
          language: options.language,
          safeSearch: options.safeSearch,
          excludeTerms: options.excludeTerms,
        },
      }

      return response
    } catch (error) {
      console.error("Enhanced search error:", error)
      throw error
    }
  }

  /**
   * 검색 결과 변환
   */
  private transformSearchResults(items: any[], options: EnhancedSearchOptions): EnhancedSearchResult[] {
    if (!items || !Array.isArray(items)) {
      return []
    }

    return items.map((item, index) => {
      // 기본 결과 생성
      const result: EnhancedSearchResult = {
        title: item.title || "제목 없음",
        url: item.link || "#",
        snippet: item.snippet || "내용 없음",
        source: item.displayLink || new URL(item.link || "https://example.com").hostname,
        relevanceScore: 1 - index * 0.05, // 간단한 관련성 점수 계산
      }

      // 날짜 추출 시도
      if (item.pagemap?.metatags?.[0]?.["article:published_time"]) {
        result.date = new Date(item.pagemap.metatags[0]["article:published_time"]).toLocaleDateString()
      }

      // 이미지 URL 추출
      if (options.includeImages && item.pagemap?.cse_image?.[0]?.src) {
        result.imageUrl = item.pagemap.cse_image[0].src
      }

      // 파일 유형 추출
      if (item.fileFormat) {
        result.fileType = item.fileFormat
      } else if (item.link) {
        const extension = item.link.split(".").pop()?.toLowerCase()
        if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
          result.fileType = extension
        }
      }

      return result
    })
  }

  /**
   * 필터를 쿼리에 적용
   */
  private applyFiltersToQuery(query: string, filters: SearchFilters): string {
    let enhancedQuery = query

    // 사이트 제한
    if (filters.siteRestriction) {
      enhancedQuery += ` site:${filters.siteRestriction}`
    }

    // 파일 유형
    if (filters.fileType) {
      enhancedQuery += ` filetype:${filters.fileType}`
    }

    // 제외 용어
    if (filters.excludeTerms && filters.excludeTerms.length > 0) {
      enhancedQuery += " " + filters.excludeTerms.map((term) => `-${term}`).join(" ")
    }

    return enhancedQuery
  }

  /**
   * 관련 쿼리 생성
   */
  private generateRelatedQueries(query: string): string[] {
    // 실제 구현에서는 API를 통해 관련 쿼리를 가져옴
    // 여기서는 간단한 구현
    const words = query.toLowerCase().split(/\s+/)

    if (words.length <= 1) {
      return [`${query} 의미`, `${query} 예시`, `${query} 정의`, `${query} 사용법`, `${query} 종류`]
    }

    const relatedQueries = [query + " 방법", query + " 예시", query + " 의미", "최고의 " + query, query + " 비교"]

    return relatedQueries
  }

  /**
   * 주요 발췌 생성
   */
  private generateFeaturedSnippet(
    query: string,
    topResult: EnhancedSearchResult,
  ): EnhancedSearchResponse["featuredSnippet"] {
    // 실제 구현에서는 API 응답에서 주요 발췌를 가져옴
    // 여기서는 간단한 구현
    return {
      title: topResult.title,
      content: topResult.snippet,
      source: topResult.source,
      url: topResult.url,
    }
  }

  /**
   * 검색 쿼리 기록
   */
  private recordQuery(query: string): void {
    const normalizedQuery = query.trim().toLowerCase()

    // 최근 쿼리에 추가
    this.recentQueries.add(normalizedQuery)

    // 최대 크기 유지
    if (this.recentQueries.size > 20) {
      const iterator = this.recentQueries.values()
      this.recentQueries.delete(iterator.next().value)
    }
  }

  /**
   * 검색 기록 업데이트
   */
  private updateSearchHistory(query: string, resultCount: number): void {
    this.searchHistory.unshift({
      query,
      timestamp: Date.now(),
      resultCount,
    })

    // 최대 크기 유지
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize)
    }

    this.saveHistory()
  }

  /**
   * 검색 기록 가져오기
   */
  public getSearchHistory(): { query: string; timestamp: number; resultCount: number }[] {
    return [...this.searchHistory]
  }

  /**
   * 최근 쿼리 가져오기
   */
  public getRecentQueries(): string[] {
    return Array.from(this.recentQueries)
  }

  /**
   * 검색 기록 지우기
   */
  public clearSearchHistory(): void {
    this.searchHistory = []
    this.saveHistory()
  }

  /**
   * 최근 쿼리 지우기
   */
  public clearRecentQueries(): void {
    this.recentQueries.clear()
  }

  /**
   * 검색 기록 로드
   */
  private loadHistory(): void {
    if (typeof window === "undefined") return

    try {
      const savedHistory = localStorage.getItem("search_history")
      const savedQueries = localStorage.getItem("recent_queries")

      if (savedHistory) {
        this.searchHistory = JSON.parse(savedHistory)
      }

      if (savedQueries) {
        this.recentQueries = new Set(JSON.parse(savedQueries))
      }
    } catch (error) {
      console.error("Failed to load search history:", error)
    }
  }

  /**
   * 검색 기록 저장
   */
  private saveHistory(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("search_history", JSON.stringify(this.searchHistory))
      localStorage.setItem("recent_queries", JSON.stringify(Array.from(this.recentQueries)))
    } catch (error) {
      console.error("Failed to save search history:", error)
    }
  }

  /**
   * 검색어 자동 완성
   */
  public autocomplete(query: string): string[] {
    if (!query.trim()) {
      return []
    }

    const normalizedQuery = query.trim().toLowerCase()

    // 최근 쿼리에서 자동 완성 후보 찾기
    const fromRecent = Array.from(this.recentQueries)
      .filter((q) => q.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)

    // 검색 기록에서 자동 완성 후보 찾기
    const fromHistory = this.searchHistory
      .map((h) => h.query)
      .filter((q) => q.toLowerCase().includes(normalizedQuery) && !fromRecent.includes(q))
      .slice(0, 5)

    // 결합 및 중복 제거
    return [...new Set([...fromRecent, ...fromHistory])].slice(0, 10)
  }
}

// 싱글톤 인스턴스 생성
export const enhancedSearch = new EnhancedSearch()
