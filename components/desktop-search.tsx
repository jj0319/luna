"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ExternalLink, AlertCircle } from "lucide-react"
import { isGoogleSearchConfigured } from "@/lib/env-config"

// Search result interface
interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink?: string
  pagemap?: {
    cse_image?: { src: string }[]
    [key: string]: any
  }
}

export default function DesktopSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchInfo, setSearchInfo] = useState<{
    totalResults: string
    searchTime: number
  } | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Call the search API
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API 요청 실패: ${response.status}`)
      }

      const data = await response.json()

      setResults(data.items || [])
      setSearchInfo({
        totalResults: data.searchInformation.totalResults,
        searchTime: data.searchInformation.searchTime,
      })
    } catch (err) {
      console.error("검색 오류:", err)
      setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다.")
      setResults([])
      setSearchInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Google 검색</CardTitle>
        <CardDescription>Google Custom Search API를 사용한 웹 검색</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="검색어를 입력하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? "검색 중..." : "검색"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">오류 발생</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {searchInfo && (
          <div className="text-sm text-gray-500 mb-4">
            약 {Number.parseInt(searchInfo.totalResults).toLocaleString()}개의 결과 (검색 시간:{" "}
            {searchInfo.searchTime.toFixed(2)}초)
          </div>
        )}

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-sm text-gray-500">{result.displayLink}</div>
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {result.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-gray-700">{result.snippet}</p>

                  {result.pagemap?.cse_image && result.pagemap.cse_image[0]?.src && (
                    <div className="mt-2">
                      <img
                        src={result.pagemap.cse_image[0].src || "/placeholder.svg?height=200&width=300"}
                        alt={result.title}
                        className="h-20 object-contain rounded-md"
                        onError={(e) => {
                          // 이미지 로드 실패 시 이미지 숨김
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !isLoading &&
            !error && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>검색어를 입력하고 검색 버튼을 클릭하세요</p>
              </div>
            )
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {isGoogleSearchConfigured()
          ? "검색 결과는 Google Custom Search API를 통해 제공됩니다."
          : "Google API 키가 설정되지 않아 모의 데이터를 사용합니다."}
      </CardFooter>
    </Card>
  )
}
