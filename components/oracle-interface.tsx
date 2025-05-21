"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { oracleSystem, type ProcessResult, type Context } from "@/lib/oracle-core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  Send,
  RefreshCcw,
  Settings,
  Info,
  Brain,
  MessageSquare,
  Database,
  Lightbulb,
  BarChart,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { SearchResultsDisplay } from "@/components/search-results-display"

interface Message {
  id: string
  content: string
  sender: "user" | "oracle"
  timestamp: number
  metadata?: any
}

export function OracleInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [showSettings, setShowSettings] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    enableLearning: true,
    enableEmotions: true,
    enableMultimodal: true,
    enablePersonalization: true,
    enableSearch: true,
    debugMode: false,
  })
  const [moduleWeights, setModuleWeights] = useState({
    knowledgeGraph: 20,
    memorySystem: 15,
    reasoningEngine: 25,
    personalizationEngine: 15,
    emotionDetector: 10,
    multiModalProcessor: 10,
    searchModule: 5,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(`session_${Date.now()}`)
  const context = useRef<Context>({
    sessionId: sessionId.current,
    timestamp: Date.now(),
    previousInteractions: [],
  })

  // 시스템 초기화
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        await oracleSystem.initialize()

        // 시스템 상태 가져오기
        const status = oracleSystem.getSystemStatus()
        setSystemStatus(status)

        // 환영 메시지 추가
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            content:
              "안녕하세요! ORACLE(Omniscient Reasoning And Cognitive Learning Engine)입니다. 다양한 AI 기술을 통합한 고급 인지 시스템으로, 어떤 질문이나 요청이든 도와드릴 수 있습니다. 무엇을 도와드릴까요?",
            sender: "oracle",
            timestamp: Date.now(),
            metadata: {
              source: "system_initialization",
              confidence: 1.0,
            },
          },
        ])
      } catch (error) {
        console.error("시스템 초기화 오류:", error)
        setMessages([
          {
            id: `error-${Date.now()}`,
            content: "시스템 초기화 중 오류가 발생했습니다. 새로고침 후 다시 시도해 주세요.",
            sender: "oracle",
            timestamp: Date.now(),
            metadata: {
              source: "error_handler",
              error: String(error),
            },
          },
        ])
      } finally {
        setIsInitializing(false)
      }
    }

    initializeSystem()

    // 컴포넌트 언마운트 시 정리
    return () => {
      oracleSystem.shutdown().catch(console.error)
    }
  }, [])

  // 메시지 변경 시 스크롤 아래로
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 설정 변경 시 시스템 업데이트
  useEffect(() => {
    oracleSystem.updateSettings(settings)
  }, [settings])

  // 모듈 가중치 변경 시 시스템 업데이트
  useEffect(() => {
    const normalizedWeights = Object.entries(moduleWeights).reduce(
      (acc, [key, value]) => {
        acc[key] = value / 100
        return acc
      },
      {} as Record<string, number>,
    )

    oracleSystem.updateModuleWeights(normalizedWeights)
  }, [moduleWeights])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // 컨텍스트 업데이트
      context.current.previousInteractions = [
        ...(context.current.previousInteractions || []),
        { input, response: "", timestamp: Date.now() },
      ].slice(-5) // 최근 5개 상호작용만 유지

      context.current.timestamp = Date.now()

      // 입력 처리
      const result: ProcessResult = await oracleSystem.processInput(input, context.current)

      // 응답 메시지 생성
      const oracleMessage: Message = {
        id: `oracle-${Date.now()}`,
        content: result.response,
        sender: "oracle",
        timestamp: Date.now(),
        metadata: {
          ...result.metadata,
          confidence: result.confidence,
          source: result.source,
          suggestedActions: result.suggestedActions,
          followUpQuestions: result.followUpQuestions,
        },
      }

      setMessages((prev) => [...prev, oracleMessage])

      // 컨텍스트의 마지막 응답 업데이트
      if (context.current.previousInteractions?.length) {
        const lastIndex = context.current.previousInteractions.length - 1
        context.current.previousInteractions[lastIndex].response = result.response
      }

      // 시스템 상태 업데이트
      setSystemStatus(oracleSystem.getSystemStatus())
    } catch (error) {
      console.error("메시지 처리 오류:", error)

      // 오류 메시지 추가
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "죄송합니다, 메시지를 처리하는 중에 오류가 발생했습니다.",
        sender: "oracle",
        timestamp: Date.now(),
        metadata: {
          error: String(error),
          source: "error_handler",
        },
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    // 대화 초기화
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        content: "대화가 초기화되었습니다. 새로운 대화를 시작합니다. 무엇을 도와드릴까요?",
        sender: "oracle",
        timestamp: Date.now(),
        metadata: {
          source: "system_reset",
          confidence: 1.0,
        },
      },
    ])

    // 세션 ID 재생성
    sessionId.current = `session_${Date.now()}`

    // 컨텍스트 초기화
    context.current = {
      sessionId: sessionId.current,
      timestamp: Date.now(),
      previousInteractions: [],
    }
  }

  const toggleMessageMetadata = (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId)
  }

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleModuleWeightChange = (module: string, value: number[]) => {
    setModuleWeights((prev) => ({ ...prev, [module]: value[0] }))
  }

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-bold">ORACLE 시스템 초기화 중...</h2>
          <p className="text-muted-foreground">다양한 AI 모듈을 로드하고 있습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ORACLE</h1>
            <Badge variant="outline" className="ml-2">
              v1.0.0
            </Badge>
          </div>
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>대화</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>시스템</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
              <span>설정</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="mt-0">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="ORACLE" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">ORACLE 인터페이스</CardTitle>
                  <p className="text-sm text-muted-foreground">통합 AI 시스템</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowMetadata(!showMetadata)}
                  title={showMetadata ? "메타데이터 숨기기" : "메타데이터 표시"}
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetChat} title="대화 초기화">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] space-y-2`}>
                        <div className="flex items-start gap-2">
                          {message.sender === "oracle" && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="ORACLE" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {message.sender === "oracle" && message.metadata?.confidence && (
                                <div className="flex items-center justify-between mb-1">
                                  <Badge variant="outline" className="text-xs font-normal" title="응답 신뢰도">
                                    신뢰도: {(message.metadata.confidence * 100).toFixed(0)}%
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => toggleMessageMetadata(message.id)}
                                    title={expandedMessageId === message.id ? "메타데이터 접기" : "메타데이터 펼치기"}
                                  >
                                    {expandedMessageId === message.id ? (
                                      <ChevronUp className="h-3 w-3" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              )}
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </div>

                            {/* 메타데이터 표시 */}
                            {showMetadata && message.sender === "oracle" && expandedMessageId === message.id && (
                              <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs">
                                <div className="font-semibold mb-1">메타데이터</div>
                                <div className="space-y-2">
                                  {message.metadata?.source && (
                                    <div>
                                      <span className="font-medium">소스:</span> {message.metadata.source}
                                    </div>
                                  )}

                                  {message.metadata?.emotions && (
                                    <div>
                                      <span className="font-medium">감정 분석:</span>{" "}
                                      {message.metadata.emotions.dominant || "중립"} (
                                      {message.metadata.emotions.confidence
                                        ? `${(message.metadata.emotions.confidence * 100).toFixed(0)}%`
                                        : "N/A"}
                                      )
                                    </div>
                                  )}

                                  {message.metadata?.reasoning && (
                                    <div>
                                      <span className="font-medium">추론:</span>{" "}
                                      {message.metadata.reasoning.conclusion || "N/A"}
                                    </div>
                                  )}

                                  {message.metadata?.executionTime && (
                                    <div>
                                      <span className="font-medium">처리 시간:</span> {message.metadata.executionTime}ms
                                    </div>
                                  )}

                                  {message.metadata?.moduleContributions && (
                                    <div>
                                      <span className="font-medium">모듈 기여도:</span>
                                      <div className="grid grid-cols-2 gap-x-4 mt-1">
                                        {Object.entries(message.metadata.moduleContributions).map(([module, value]) => (
                                          <div key={module} className="text-xs">
                                            {module}:{" "}
                                            {typeof value === "number" ? (value * 100).toFixed(0) + "%" : value}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {message.metadata?.search && (
                                    <div>
                                      <span className="font-medium">검색:</span> {message.metadata.search.query} (
                                      {message.metadata.search.results?.length || 0}개 결과)
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {message.sender === "oracle" && message.metadata?.search?.results?.length > 0 && (
                              <SearchResultsDisplay
                                results={message.metadata.search.results}
                                query={message.metadata.search.query}
                              />
                            )}

                            {/* 후속 질문 표시 */}
                            {message.sender === "oracle" &&
                              message.metadata?.followUpQuestions &&
                              message.metadata.followUpQuestions.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {message.metadata.followUpQuestions.map((question: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="cursor-pointer hover:bg-secondary/80"
                                      onClick={() => {
                                        setInput(question)
                                      }}
                                    >
                                      {question}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                            <div className="text-xs text-right mt-1 text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          {message.sender === "user" && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="ORACLE" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-muted">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex w-full gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  disabled={isProcessing}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isProcessing}>
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                시스템 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              {systemStatus ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          시스템 성능
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">가동 시간:</span>
                            <span className="text-sm font-medium">
                              {Math.floor(systemStatus.uptime / 1000 / 60)} 분
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">상호작용 수:</span>
                            <span className="text-sm font-medium">{systemStatus.interactionCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">현재 부하:</span>
                            <span className="text-sm font-medium">{systemStatus.currentLoad || 0}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Brain className="h-4 w-4 text-blue-500" />
                          활성 모듈
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-1">
                          {systemStatus.activeModules.map((module: string) => (
                            <Badge key={module} variant="outline" className="mr-1 mb-1">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          학습 상태
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">학습 진행도:</span>
                            <span className="text-sm font-medium">
                              {Math.round(systemStatus.learningProgress * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${Math.round(systemStatus.learningProgress * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-indigo-500" />
                        모듈 성능 분석
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        {Object.entries(moduleWeights).map(([module, weight]) => (
                          <div key={module} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">{module}:</span>
                              <span className="text-sm font-medium">{weight}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${weight}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                시스템 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">기능 설정</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableLearning" className="text-base">
                          학습 활성화
                        </Label>
                        <p className="text-sm text-muted-foreground">상호작용을 통한 지속적 학습 기능</p>
                      </div>
                      <Switch
                        id="enableLearning"
                        checked={settings.enableLearning}
                        onCheckedChange={(value) => handleSettingChange("enableLearning", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableEmotions" className="text-base">
                          감정 인식 활성화
                        </Label>
                        <p className="text-sm text-muted-foreground">감정 분석 및 공감적 응답 생성</p>
                      </div>
                      <Switch
                        id="enableEmotions"
                        checked={settings.enableEmotions}
                        onCheckedChange={(value) => handleSettingChange("enableEmotions", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableMultimodal" className="text-base">
                          멀티모달 처리 활성화
                        </Label>
                        <p className="text-sm text-muted-foreground">이미지, 오디오 등 다양한 형식의 입력 처리</p>
                      </div>
                      <Switch
                        id="enableMultimodal"
                        checked={settings.enableMultimodal}
                        onCheckedChange={(value) => handleSettingChange("enableMultimodal", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enablePersonalization" className="text-base">
                          개인화 활성화
                        </Label>
                        <p className="text-sm text-muted-foreground">사용자 맞춤형 응답 생성</p>
                      </div>
                      <Switch
                        id="enablePersonalization"
                        checked={settings.enablePersonalization}
                        onCheckedChange={(value) => handleSettingChange("enablePersonalization", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableSearch" className="text-base">
                          검색 활성화
                        </Label>
                        <p className="text-sm text-muted-foreground">실시간 웹 검색 기능</p>
                      </div>
                      <Switch
                        id="enableSearch"
                        checked={settings.enableSearch}
                        onCheckedChange={(value) => handleSettingChange("enableSearch", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debugMode" className="text-base">
                          디버그 모드
                        </Label>
                        <p className="text-sm text-muted-foreground">상세 로그 및 디버깅 정보 표시</p>
                      </div>
                      <Switch
                        id="debugMode"
                        checked={settings.debugMode}
                        onCheckedChange={(value) => handleSettingChange("debugMode", value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">모듈 가중치 설정</h3>
                  <p className="text-sm text-muted-foreground">
                    각 모듈이 최종 응답 생성에 기여하는 비중을 조정합니다.
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="knowledgeGraph" className="text-base">
                          지식 그래프
                        </Label>
                        <span className="text-sm">{moduleWeights.knowledgeGraph}%</span>
                      </div>
                      <Slider
                        id="knowledgeGraph"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.knowledgeGraph]}
                        onValueChange={(value) => handleModuleWeightChange("knowledgeGraph", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="memorySystem" className="text-base">
                          메모리 시스템
                        </Label>
                        <span className="text-sm">{moduleWeights.memorySystem}%</span>
                      </div>
                      <Slider
                        id="memorySystem"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.memorySystem]}
                        onValueChange={(value) => handleModuleWeightChange("memorySystem", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="reasoningEngine" className="text-base">
                          추론 엔진
                        </Label>
                        <span className="text-sm">{moduleWeights.reasoningEngine}%</span>
                      </div>
                      <Slider
                        id="reasoningEngine"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.reasoningEngine]}
                        onValueChange={(value) => handleModuleWeightChange("reasoningEngine", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="personalizationEngine" className="text-base">
                          개인화 엔진
                        </Label>
                        <span className="text-sm">{moduleWeights.personalizationEngine}%</span>
                      </div>
                      <Slider
                        id="personalizationEngine"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.personalizationEngine]}
                        onValueChange={(value) => handleModuleWeightChange("personalizationEngine", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="emotionDetector" className="text-base">
                          감정 감지기
                        </Label>
                        <span className="text-sm">{moduleWeights.emotionDetector}%</span>
                      </div>
                      <Slider
                        id="emotionDetector"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.emotionDetector]}
                        onValueChange={(value) => handleModuleWeightChange("emotionDetector", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="multiModalProcessor" className="text-base">
                          멀티모달 프로세서
                        </Label>
                        <span className="text-sm">{moduleWeights.multiModalProcessor}%</span>
                      </div>
                      <Slider
                        id="multiModalProcessor"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.multiModalProcessor]}
                        onValueChange={(value) => handleModuleWeightChange("multiModalProcessor", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="searchModule" className="text-base">
                          검색 모듈
                        </Label>
                        <span className="text-sm">{moduleWeights.searchModule}%</span>
                      </div>
                      <Slider
                        id="searchModule"
                        min={0}
                        max={100}
                        step={5}
                        value={[moduleWeights.searchModule]}
                        onValueChange={(value) => handleModuleWeightChange("searchModule", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
