/**
 * Google Search API Integration
 *
 * This module provides functions to interact with the Google Custom Search API.
 */

// 하드코딩된 API 키와 ID 가져오기
import { ENV } from "@/config/env"

// 이 변수들을 사용하여 process.env 대신 접근
const GOOGLE_API_KEY = ENV.GOOGLE_API_KEY
const GOOGLE_ID = ENV.GOOGLE_ID

// Search result interface
export interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink?: string
  pagemap?: {
    cse_image?: { src: string }[]
    [key: string]: any
  }
}

// Search response interface
export interface SearchResponse {
  items: SearchResult[]
  searchInformation: {
    totalResults: string
    searchTime: number
  }
}

/**
 * Perform a Google search using the Custom Search API
 *
 * @param query The search query
 * @param options Additional options for the search
 * @returns Promise with search results
 */
export async function performGoogleSearch(
  query: string,
  options: { num?: number; start?: number } = {},
): Promise<SearchResponse> {
  try {
    const apiKey = GOOGLE_API_KEY
    const searchEngineId = GOOGLE_ID

    if (!apiKey || !searchEngineId) {
      throw new Error("Google API 키 또는 검색 엔진 ID가 설정되지 않았습니다.")
    }

    // Build the search URL
    const baseUrl = "https://www.googleapis.com/customsearch/v1"
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      q: query,
      num: (options.num || 10).toString(),
      start: (options.start || 1).toString(),
    })

    // Make the API request
    const response = await fetch(`${baseUrl}?${params.toString()}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `API 요청 실패: ${response.status}`)
    }

    const data = await response.json()

    // Return formatted search response
    return {
      items: data.items || [],
      searchInformation: {
        totalResults: data.searchInformation?.totalResults || "0",
        searchTime: data.searchInformation?.searchTime || 0,
      },
    }
  } catch (error) {
    console.error("Google 검색 오류:", error)
    throw error
  }
}

/**
 * Check if Google Search API is properly configured
 *
 * @returns Boolean indicating if API is configured
 */
export function isGoogleSearchConfigured(): boolean {
  return !!(GOOGLE_API_KEY && GOOGLE_ID)
}

/**
 * Mock search function for testing or when API is not available
 *
 * @param query The search query
 * @returns Promise with mock search results
 */
export async function performMockSearch(query: string): Promise<SearchResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Generate mock results based on query
  const mockResults: SearchResult[] = [
    {
      title: `${query}에 대한 검색 결과 1`,
      link: "https://example.com/result1",
      snippet: `이것은 "${query}"에 대한 첫 번째 검색 결과입니다. 여기에는 검색어와 관련된 정보가 포함되어 있습니다.`,
      displayLink: "example.com",
    },
    {
      title: `${query} - 위키백과`,
      link: "https://example.com/wiki",
      snippet: `${query}는 다양한 의미를 가질 수 있습니다. 이 페이지는 관련된 여러 주제에 대한 개요를 제공합니다.`,
      displayLink: "example.com/wiki",
      pagemap: {
        cse_image: [{ src: "https://via.placeholder.com/150" }],
      },
    },
    {
      title: `${query} 관련 최신 뉴스`,
      link: "https://example.com/news",
      snippet: `${query}에 대한 최신 뉴스와 업데이트를 확인하세요. 최근 개발 상황과 중요한 정보를 제공합니다.`,
      displayLink: "example.com/news",
    },
  ]

  return {
    items: mockResults,
    searchInformation: {
      totalResults: "3",
      searchTime: 0.3,
    },
  }
}
