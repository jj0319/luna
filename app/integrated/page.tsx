"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { performGoogleSearch, type SearchResult } from "@/lib/google-search"
import { isGoogleSearchConfigured } from "@/lib/env-config"
import { Search, MessageSquare, Save, ExternalLink, AlertCircle, Clock, Star, Trash2 } from "lucide-react"

// 메시지 타입 정의
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  searchResults?: SearchResult[]
}

// 검색 기록 항목 타입 정의
interface SearchHistoryItem {
  id: string
  query: string
  timestamp: Date
  saved: boolean
}

// 저장된 대화 타입 정의
interface SavedConversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

export default function IntegratedApp() {
  // 상태 관리
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content: "안녕하세요! 통합 AI 연구 플랫폼에 오신 것을 환영합니다. 질문이나 검색어를 입력해주세요.",
      timestamp: new Date(),
    },
  ])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [error, setError] = useState<string | null>(null)
  const [searchInfo, setSearchInfo] = useState<{
    totalResults: string
    searchTime: number
  } | null>(null)
  const [autoSearch, setAutoSearch] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 다크모드 토글
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // 메시지 스크롤 자동화
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        // 검색 기록 로드
        const savedSearchHistory = localStorage.getItem("searchHistory")
        if (savedSearchHistory) {
          const parsed = JSON.parse(savedSearchHistory)
          setSearchHistory(
            parsed.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp),
            })),
          )
        }

        // 저장된 대화 로드
        const savedConvos = localStorage.getItem("savedConversations")
        if (savedConvos) {
          const parsed = JSON.parse(savedConvos)
          setSavedConversations(
            parsed.map((convo: any) => ({
              ...convo,
              timestamp: new Date(convo.timestamp),
              messages: convo.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            })),
          )
        }

        // 설정 로드
        const darkModeSetting = localStorage.getItem("darkMode")
        if (darkModeSetting) {
          setDarkMode(darkModeSetting === "true")
        }

        const autoSearchSetting = localStorage.getItem("autoSearch")
        if (autoSearchSetting) {
          setAutoSearch(autoSearchSetting === "true")
        }
      } catch (error) {
        console.error("로컬 스토리지 로드 오류:", error)
      }
    }

    loadFromLocalStorage()
  }, [])

  // 로컬 스토리지에 데이터 저장
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
    }
  }, [searchHistory])

  useEffect(() => {
    if (savedConversations.length > 0) {
      localStorage.setItem("savedConversations", JSON.stringify(savedConversations))
    }
  }, [savedConversations])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("autoSearch", autoSearch.toString())
  }, [autoSearch])

  // 메시지 전송 처리
  const handleSendMessage = async () => {
    if (!input.trim()) return

    // 고유 ID 생성
    const messageId = Date.now().toString()

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 자동 검색 기능이 활성화된 경우 검색 수행
    let searchResultsForMessage: SearchResult[] = []
    if (autoSearch) {
      try {
        setError(null)

        // Google API 설정 확인
        if (isGoogleSearchConfigured()) {
          const response = await performGoogleSearch(input)
          searchResultsForMessage = response.items || []

          // 검색 기록에 추가
          addToSearchHistory(input)
        }
      } catch (err) {
        console.error("자동 검색 오류:", err)
        // 오류가 발생해도 AI 응답은 계속 진행
      }
    }

    // AI 응답 시뮬레이션 (실제 구현에서는 AI API 호출)
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: generateAIResponse(input, searchResultsForMessage),
        timestamp: new Date(),
        searchResults: searchResultsForMessage.length > 0 ? searchResultsForMessage : undefined,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  // 검색 수행
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    setError(null)

    try {
      // Google API 설정 확인
      if (!isGoogleSearchConfigured()) {
        throw new Error("Google API 키와 검색 ID가 설정되지 않았습니다.")
      }

      const response = await performGoogleSearch(searchQuery)
      setSearchResults(response.items || [])
      setSearchInfo({
        totalResults: response.searchInformation.totalResults,
        searchTime: response.searchInformation.searchTime,
      })

      // 검색 기록에 추가
      addToSearchHistory(searchQuery)
    } catch (err) {
      console.error("검색 오류:", err)
      setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다.")
      setSearchResults([])
      setSearchInfo(null)
    } finally {
      setSearchLoading(false)
    }
  }

  // 검색 기록에 추가
  const addToSearchHistory = (query: string) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      saved: false,
    }

    setSearchHistory((prev) => {
      // 중복 검색어 제거 (최신 항목만 유지)
      const filtered = prev.filter((item) => item.query !== query)
      // 최신 항목을 맨 앞에 추가 (최대 20개 유지)
      return [newItem, ...filtered].slice(0, 20)
    })
  }

  // 검색 기록 항목 클릭 처리
  const handleSearchHistoryClick = (query: string) => {
    setSearchQuery(query)
    handleSearch()
  }

  // 검색 기록 항목 저장/해제
  const toggleSaveSearchItem = (id: string) => {
    setSearchHistory((prev) => prev.map((item) => (item.id === id ? { ...item, saved: !item.saved } : item)))
  }

  // 검색 기록 항목 삭제
  const deleteSearchHistoryItem = (id: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id))
  }

  // 현재 대화 저장
  const saveCurrentConversation = () => {
    if (messages.length <= 1) return // 시스템 메시지만 있는 경우 저장하지 않음

    const title = messages.find((m) => m.role === "user")?.content.slice(0, 30) + "..." || "새 대화"

    const newConversation: SavedConversation = {
      id: Date.now().toString(),
      title,
      messages: [...messages],
      timestamp: new Date(),
    }

    setSavedConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
  }

  // 저장된 대화 불러오기
  const loadConversation = (id: string) => {
    const conversation = savedConversations.find((c) => c.id === id)
    if (conversation) {
      setMessages([...conversation.messages])
      setCurrentConversationId(id)
    }
  }

  // 새 대화 시작
  const startNewConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "system",
        content: "안녕하세요! 통합 AI 연구 플랫폼에 오신 것을 환영합니다. 질문이나 검색어를 입력해주세요.",
        timestamp: new Date(),
      },
    ])
    setCurrentConversationId(null)
  }

  // 저장된 대화 삭제
  const deleteConversation = (id: string) => {
    setSavedConversations((prev) => prev.filter((c) => c.id !== id))
    if (currentConversationId === id) {
      startNewConversation()
    }
  }

  // AI 응답 생성 (실제 구현에서는 AI API 호출)
  const generateAIResponse = (query: string, searchResults: SearchResult[]): string => {
    // 간단한 응답 생성 로직 (실제 AI 응답 대신 사용)
    if (searchResults.length > 0) {
      return `"${query}"에 대한 검색 결과를 찾았습니다. 검색 결과를 기반으로 답변드리자면, ${searchResults[0].snippet} 추가 정보가 필요하시면 더 구체적인 질문을 해주세요.`
    }

    // 기본 응답
    if (query.includes("안녕") || query.includes("hello")) {
      return "안녕하세요! 무엇을 도와드릴까요?"
    } else if (query.includes("날씨")) {
      return "죄송합니다. 현재 실시간 날씨 정보는 제공하지 않습니다. 대신 날씨 관련 일반적인 정보는 도와드릴 수 있습니다."
    } else if (query.includes("시간") || query.includes("날짜")) {
      return `현재 시간은 ${new Date().toLocaleTimeString()}, 날짜는 ${new Date().toLocaleDateString()} 입니다.`
    } else if (query.length < 10) {
      return `'${query}'에 대한 더 자세한 정보가 필요합니다. 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다.`
    } else {
      return `질문하신 '${query}'에 대해 현재 제한된 정보만 제공할 수 있습니다. 이 기능은 개발 중이며, 곧 더 나은 응답을 제공할 예정입니다.`
    }
  }

  // 타임스탬프 포맷팅
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toLocaleDateString()
  }

  return (
    <div className={`flex h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      {/* 사이드바 */}
      {sidebarOpen && (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* 사이드바 헤더 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-white">AI 연구 플랫폼</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">개인용 통합 버전</p>
          </div>

          {/* 대화 목록 */}
          <div className="flex-1 overflow-auto">
            <div className="p-3">
              <Button variant="outline" className="w-full justify-start mb-2" onClick={startNewConversation}>
                <MessageSquare className="h-4 w-4 mr-2" />새 대화
              </Button>

              <Separator className="my-2" />

              <h3 className="text-sm font-medium mb-2 dark:text-gray-300">저장된 대화</h3>

              {savedConversations.length > 0 ? (
                <div className="space-y-1">
                  {savedConversations.map((convo) => (
                    <div
                      key={convo.id}
                      className={`flex items-center justify-between p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                        currentConversationId === convo.id ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                    >
                      <div className="flex-1 truncate" onClick={() => loadConversation(convo.id)}>
                        <div className="font-medium truncate dark:text-white">{convo.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(convo.timestamp)}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteConversation(convo.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">저장된 대화가 없습니다</p>
              )}
            </div>
          </div>

          {/* 사이드바 푸터 */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="dark-mode" className="text-sm dark:text-white">
                다크 모드
              </Label>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-search" className="text-sm dark:text-white">
                자동 검색
              </Label>
              <Switch id="auto-search" checked={autoSearch} onCheckedChange={setAutoSearch} />
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-2">
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>

          <Tabs value={activeTab} className="flex-1" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                대화
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="h-4 w-4 mr-2" />
                검색
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="h-4 w-4 mr-2" />
                기록
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={saveCurrentConversation} disabled={messages.length <= 1}>
              <Save className="h-4 w-4 mr-1" />
              저장
            </Button>
          </div>
        </header>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-hidden">
          {/* 대화 탭 */}
          {activeTab === "chat" && (
            <div className="h-full flex flex-col p-4">
              <Card className="flex-1 flex flex-col">
                <CardContent className="flex-1 overflow-hidden p-4">
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    {messages.map((message, index) => (
                      <div key={message.id} className="mb-4">
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                              : message.role === "system"
                                ? "bg-muted mr-auto max-w-[80%]"
                                : "bg-muted mr-auto max-w-[80%]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">
                              {message.role === "user"
                                ? "사용자"
                                : message.role === "system"
                                  ? "시스템"
                                  : "AI 어시스턴트"}
                            </span>
                            <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {/* 검색 결과 표시 (AI 응답에만) */}
                        {message.role === "assistant" && message.searchResults && message.searchResults.length > 0 && (
                          <div className="mt-2 mr-auto max-w-[80%]">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">관련 검색 결과:</div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800">
                              {message.searchResults.slice(0, 2).map((result, idx) => (
                                <div key={idx} className="mb-2 last:mb-0">
                                  <a
                                    href={result.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    {result.title}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {result.snippet}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="mr-auto max-w-[80%] mb-4">
                        <div className="rounded-lg p-3 bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse h-2 w-2 rounded-full bg-gray-400"></div>
                            <div className="animate-pulse h-2 w-2 rounded-full bg-gray-400 animation-delay-200"></div>
                            <div className="animate-pulse h-2 w-2 rounded-full bg-gray-400 animation-delay-400"></div>
                            <span className="text-xs">AI가 응답을 생성하는 중...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Textarea
                      ref={inputRef}
                      placeholder="메시지를 입력하세요..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="flex-1 min-h-[60px]"
                    />
                    <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                      전송
                    </Button>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {autoSearch ? "자동 검색 활성화됨" : "자동 검색 비활성화됨"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Shift + Enter로 줄바꿈</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 검색 탭 */}
          {activeTab === "search" && (
            <div className="h-full p-4">
              <Card className="h-full flex flex-col">
                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="검색어를 입력하세요..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch()
                        }
                      }}
                    />
                    <Button onClick={handleSearch} disabled={searchLoading || !searchQuery.trim()}>
                      {searchLoading ? "검색 중..." : "검색"}
                    </Button>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-red-800 dark:text-red-300 font-medium">오류 발생</p>
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {searchInfo && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      약 {Number.parseInt(searchInfo.totalResults).toLocaleString()}개의 결과 (검색 시간:{" "}
                      {searchInfo.searchTime.toFixed(2)}초)
                    </div>
                  )}

                  <ScrollArea className="flex-1">
                    {searchLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-6">
                        {searchResults.map((result, index) => (
                          <div key={index} className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{result.displayLink}</div>
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-medium text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {result.title}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{result.snippet}</p>

                            {result.pagemap?.cse_image && result.pagemap.cse_image[0]?.src && (
                              <div className="mt-2">
                                <img
                                  src={result.pagemap.cse_image[0].src || "/placeholder.svg"}
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
                      !searchLoading &&
                      !error && (
                        <div className="p-8 text-center text-muted-foreground">
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p>검색어를 입력하고 검색 버튼을 클릭하세요</p>
                        </div>
                      )
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 기록 탭 */}
          {activeTab === "history" && (
            <div className="h-full p-4">
              <Card className="h-full flex flex-col">
                <CardContent className="flex-1 p-4">
                  <h3 className="text-lg font-medium mb-4 dark:text-white">검색 기록</h3>

                  <ScrollArea className="h-[calc(100vh-180px)]">
                    {searchHistory.length > 0 ? (
                      <div className="space-y-1">
                        {searchHistory.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex-1 cursor-pointer" onClick={() => handleSearchHistoryClick(item.query)}>
                              <div className="font-medium dark:text-white">{item.query}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(item.timestamp)} {formatTimestamp(item.timestamp)}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleSaveSearchItem(item.id)}
                              >
                                {item.saved ? (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => deleteSearchHistoryItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>검색 기록이 없습니다</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 사이드바 토글 아이콘 컴포넌트
function ChevronLeft(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
