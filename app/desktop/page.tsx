"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DesktopSearch from "@/components/desktop-search"
import { MessageSquare, Search, Database, Brain, Settings, Download } from "lucide-react"

export default function DesktopApp() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "안녕하세요! 통합 AI 플랫폼에 오신 것을 환영합니다. 질문이나 요청사항이 있으시면 말씀해주세요.",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")

  const handleSendMessage = () => {
    if (!input.trim()) return

    // 사용자 메시지 추가
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // AI 응답 시뮬레이션 (로컬 환경에서 작동)
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: "안녕하세요! 로컬 환경에서 실행 중인 AI 어시스턴트입니다. 어떻게 도와드릴까요?",
        timestamp: new Date(),
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* 사이드바 */}
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <Button
          variant={activeTab === "chat" ? "default" : "ghost"}
          size="icon"
          className="mb-4"
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "ghost"}
          size="icon"
          className="mb-4"
          onClick={() => setActiveTab("search")}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "database" ? "default" : "ghost"}
          size="icon"
          className="mb-4"
          onClick={() => setActiveTab("database")}
        >
          <Database className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === "models" ? "default" : "ghost"}
          size="icon"
          className="mb-4"
          onClick={() => setActiveTab("models")}
        >
          <Brain className="h-5 w-5" />
        </Button>
        <div className="flex-grow" />
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <h1 className="text-lg font-semibold">AI 연구 플랫폼</h1>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">로컬 환경</Badge>
          </div>
        </header>

        {/* 탭 콘텐츠 */}
        <Tabs value={activeTab} className="flex-1 flex flex-col">
          <TabsContent
            value="chat"
            className="flex-1 flex flex-col p-4 data-[state=active]:flex data-[state=inactive]:hidden"
          >
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>AI 대화</CardTitle>
                <CardDescription>AI 어시스턴트와 대화하세요</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${message.role === "user" ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"}`}
                    >
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
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
                        <p className="text-sm">{message.content}</p>
                      </div>
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
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Textarea
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
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="flex-1 p-4 data-[state=active]:block data-[state=inactive]:hidden">
            <DesktopSearch />
          </TabsContent>

          <TabsContent value="database" className="flex-1 p-4 data-[state=active]:block data-[state=inactive]:hidden">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>데이터베이스</CardTitle>
                <CardDescription>데이터 관리 및 분석</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="p-8 text-center text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>데이터베이스 기능은 로컬 환경에서 모의 데이터로 작동합니다</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="flex-1 p-4 data-[state=active]:block data-[state=inactive]:hidden">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>AI 모델</CardTitle>
                <CardDescription>모델 관리 및 학습</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">GPT-2</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">텍스트 생성 모델</p>
                      <Badge className="mt-2">로컬 모의 모델</Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        모델 다운로드
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">신경망 모델</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">기본 신경망 모델</p>
                      <Badge variant="secondary" className="mt-2">
                        로컬
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        학습 시작
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4 data-[state=active]:block data-[state=inactive]:hidden">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>설정</CardTitle>
                <CardDescription>앱 설정 및 환경 설정</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">일반 설정</h3>
                    <Separator className="mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="theme" className="text-sm">
                          테마
                        </label>
                        <select id="theme" className="text-sm p-1 border rounded">
                          <option>시스템 기본값</option>
                          <option>라이트 모드</option>
                          <option>다크 모드</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="language" className="text-sm">
                          언어
                        </label>
                        <select id="language" className="text-sm p-1 border rounded">
                          <option>한국어</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">API 설정</h3>
                    <Separator className="mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="google-api" className="text-sm">
                          Google API 키
                        </label>
                        <Input
                          id="google-api"
                          type="text"
                          value="로컬 환경에서 실행 중"
                          disabled
                          className="w-64 h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="google-cx" className="text-sm">
                          Google 검색 ID
                        </label>
                        <Input
                          id="google-cx"
                          type="text"
                          value="로컬 환경에서 실행 중"
                          disabled
                          className="w-64 h-8 text-sm"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        로컬 환경에서는 모의 데이터를 사용하므로 API 키가 필요하지 않습니다.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">AI 설정</h3>
                    <Separator className="mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="model" className="text-sm">
                          기본 모델
                        </label>
                        <select id="model" className="text-sm p-1 border rounded">
                          <option>로컬 모델</option>
                          <option>GPT-2</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">앱 정보</h3>
                    <Separator className="mb-4" />
                    <div className="space-y-1 text-sm">
                      <p>버전: 1.0.0</p>
                      <p>빌드: {new Date().toLocaleDateString()}</p>
                      <p>실행 환경: 로컬</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
