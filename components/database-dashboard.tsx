"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Download,
  Database,
  Search,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

import database, {
  type ResponseData,
  type DatabaseStats,
  getResponses,
  getStats,
  clearDatabase,
  exportDatabase,
  generateReport,
} from "@/database"

export default function DatabaseDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [responses, setResponses] = useState<ResponseData[]>([])
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exportText, setExportText] = useState<string | null>(null)
  const [showExport, setShowExport] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Load data when search query changes
  useEffect(() => {
    if (!isLoading) {
      const filteredResponses = getResponses({
        query: searchQuery,
        limit: 100,
      })
      setResponses(filteredResponses)
    }
  }, [searchQuery, isLoading])

  const loadData = () => {
    setIsLoading(true)
    setError(null)

    try {
      // Initialize database if needed
      if (typeof window !== "undefined" && database.initDatabase) {
        database.initDatabase()
      }

      // Get responses and stats
      const allResponses = getResponses({ limit: 100 })
      const dbStats = getStats()

      setResponses(allResponses)
      setStats(dbStats)
    } catch (err) {
      console.error("Error loading database data:", err)
      setError("Failed to load database data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to clear all database data? This cannot be undone.")) {
      clearDatabase()
      loadData()
    }
  }

  const handleExportDatabase = () => {
    try {
      const exportData = exportDatabase()
      setExportText(exportData)
      setShowExport(true)
    } catch (err) {
      console.error("Error exporting database:", err)
      setError("Failed to export database data.")
    }
  }

  const handleGenerateReport = () => {
    try {
      const report = generateReport()
      setExportText(report)
      setShowExport(true)
    } catch (err) {
      console.error("Error generating report:", err)
      setError("Failed to generate database report.")
    }
  }

  const handleDownloadExport = () => {
    if (!exportText) return

    const blob = new Blob([exportText], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ai-database-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>응답 데이터베이스 대시보드</CardTitle>
            <CardDescription>챗봇 응답 데이터 관리 및 분석</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerateReport}>
              <BarChart className="h-4 w-4 mr-2" />
              보고서
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportDatabase}>
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearDatabase}>
              <Trash2 className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showExport && exportText && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">내보내기 데이터</h3>
              <Button
                size="sm"
                onClick={() => {
                  handleDownloadExport()
                  setShowExport(false)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
            </div>
            <ScrollArea className="h-[200px] w-full border rounded-md p-4">
              <pre className="text-xs">{exportText}</pre>
            </ScrollArea>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowExport(false)}>
              닫기
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="responses">응답 데이터</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin">
                  <RefreshCw className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">데이터베이스 통계</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">총 응답 수:</span>
                        <span className="font-medium">{stats.totalResponses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">총 피드백 수:</span>
                        <span className="font-medium">{stats.totalFeedback}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">평균 평가:</span>
                        <span className="font-medium">{(stats.averageRating * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">마지막 업데이트:</span>
                        <span className="font-medium">{formatDate(stats.lastUpdated)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">인기 질문</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topQueries.length > 0 ? (
                      <ul className="space-y-2">
                        {stats.topQueries.slice(0, 5).map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="text-muted-foreground truncate mr-2">{truncateText(item.query, 30)}</span>
                            <Badge variant="outline">{item.count}회</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">데이터가 없습니다</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">최근 응답</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {responses.length > 0 ? (
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                          {responses.slice(0, 5).map((response) => (
                            <div key={response.id} className="border-b pb-3">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{truncateText(response.query, 50)}</span>
                                <span className="text-xs text-muted-foreground">{formatDate(response.timestamp)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{truncateText(response.response, 100)}</p>
                              <div className="flex mt-1 space-x-1">
                                {response.metadata.categories?.map((category, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">데이터가 없습니다</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">데이터베이스가 비어 있습니다</h3>
                <p className="text-muted-foreground mb-4">챗봇과 대화하여 응답 데이터를 수집하세요.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="responses">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="응답 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin">
                  <RefreshCw className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ) : responses.length > 0 ? (
              <Table>
                <TableCaption>총 {responses.length}개의 응답</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>질문</TableHead>
                    <TableHead>응답</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>감정</TableHead>
                    <TableHead>날짜</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">{truncateText(response.query, 30)}</TableCell>
                      <TableCell>{truncateText(response.response, 50)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {response.metadata.categories?.map((category, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {response.metadata.sentiment && (
                          <div className="flex items-center">
                            {response.metadata.sentiment.label === "positive" ? (
                              <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : response.metadata.sentiment.label === "negative" ? (
                              <ThumbsDown className="h-4 w-4 text-red-500 mr-1" />
                            ) : (
                              <span className="h-4 w-4 mr-1">-</span>
                            )}
                            <span className="text-xs">{(response.metadata.sentiment.score * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(response.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">데이터가 없습니다</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "검색 결과가 없습니다." : "챗봇과 대화하여 응답 데이터를 수집하세요."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin">
                  <RefreshCw className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ) : stats && responses.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">카테고리 분포</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {calculateCategoryStats(responses).map((category) => (
                        <div key={category.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {category.count} ({category.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${category.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">감정 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {calculateSentimentStats(responses).map((sentiment) => (
                        <Card key={sentiment.label}>
                          <CardContent className="pt-6 text-center">
                            {sentiment.label === "positive" ? (
                              <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            ) : sentiment.label === "negative" ? (
                              <ThumbsDown className="h-8 w-8 mx-auto mb-2 text-red-500" />
                            ) : (
                              <div className="h-8 w-8 mx-auto mb-2 rounded-full border" />
                            )}
                            <div className="text-2xl font-bold mb-1">{sentiment.percentage.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {sentiment.label === "positive"
                                ? "긍정적"
                                : sentiment.label === "negative"
                                  ? "부정적"
                                  : "중립적"}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">시간별 활동</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end space-x-2">
                      {calculateTimeStats(responses).map((timeSlot) => (
                        <div key={timeSlot.hour} className="flex flex-col items-center flex-1">
                          <div
                            className="bg-primary w-full rounded-t-sm"
                            style={{
                              height: `${(timeSlot.percentage * 150).toFixed(0)}px`,
                              minHeight: timeSlot.count > 0 ? "4px" : "0",
                            }}
                          />
                          <div className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">
                            {timeSlot.hour}:00
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">분석할 데이터가 없습니다</h3>
                <p className="text-muted-foreground mb-4">챗봇과 대화하여 응답 데이터를 수집하세요.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {stats ? `마지막 업데이트: ${formatDate(stats.lastUpdated)}` : "데이터 없음"}
        </div>
        <div className="text-xs text-muted-foreground">
          {responses.length > 0 ? `${responses.length}개의 응답 표시 중` : ""}
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper functions for analytics

function calculateCategoryStats(responses: ResponseData[]) {
  const categories: Record<string, number> = {}
  let total = 0

  // Count categories
  responses.forEach((response) => {
    if (response.metadata.categories) {
      response.metadata.categories.forEach((category) => {
        categories[category] = (categories[category] || 0) + 1
        total++
      })
    }
  })

  // Convert to array and calculate percentages
  return Object.entries(categories)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
}

function calculateSentimentStats(responses: ResponseData[]) {
  const sentiments = {
    positive: 0,
    neutral: 0,
    negative: 0,
  }

  // Count sentiments
  responses.forEach((response) => {
    if (response.metadata.sentiment) {
      sentiments[response.metadata.sentiment.label]++
    }
  })

  const total = responses.length

  // Convert to array with percentages
  return [
    { label: "positive", count: sentiments.positive, percentage: (sentiments.positive / total) * 100 },
    { label: "neutral", count: sentiments.neutral, percentage: (sentiments.neutral / total) * 100 },
    { label: "negative", count: sentiments.negative, percentage: (sentiments.negative / total) * 100 },
  ]
}

function calculateTimeStats(responses: ResponseData[]) {
  // Initialize hours
  const hours: Record<number, number> = {}
  for (let i = 0; i < 24; i++) {
    hours[i] = 0
  }

  // Count responses by hour
  responses.forEach((response) => {
    const hour = new Date(response.timestamp).getHours()
    hours[hour]++
  })

  const total = responses.length

  // Convert to array with percentages
  return Object.entries(hours)
    .map(([hour, count]) => ({
      hour: Number.parseInt(hour),
      count,
      percentage: total > 0 ? count / total : 0,
    }))
    .sort((a, b) => a.hour - b.hour)
}
