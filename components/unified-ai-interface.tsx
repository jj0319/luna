"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Brain,
  Search,
  Database,
  Network,
  Lightbulb,
  Send,
  RefreshCw,
  Zap,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle2,
  BarChart,
  Layers,
  Sparkles,
  Download,
  Share2,
  Wifi,
  WifiOff,
} from "lucide-react"

// Simulated unified learning system
const unifiedLearningSystem = {
  isLearning: false,
  progress: 0,
  lastLearned: null as Date | null,
  startLearning: () => {
    unifiedLearningSystem.isLearning = true
    unifiedLearningSystem.progress = 0
    const interval = setInterval(() => {
      unifiedLearningSystem.progress += 10
      if (unifiedLearningSystem.progress >= 100) {
        clearInterval(interval)
        unifiedLearningSystem.isLearning = false
        unifiedLearningSystem.lastLearned = new Date()
      }
    }, 300)
  },
}

export default function UnifiedAiInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp: Date }[]>([
    {
      role: "system",
      content: "안녕하세요! 통합 AI 플랫폼에 오신 것을 환영합니다. 질문이나 요청사항이 있으시면 말씀해주세요.",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [useWebSearch, setUseWebSearch] = useState(true)
  const [useNeuralNetwork, setUseNeuralNetwork] = useState(true)
  const [useDatabase, setUseDatabase] = useState(true)
  const [creativityLevel, setCreativityLevel] = useState([50])
  const [debugMode, setDebugMode] = useState(false)
  const [thoughtProcess, setThoughtProcess] = useState<string[]>([])
  const [learningProgress, setLearningProgress] = useState(0)
  const [isLearning, setIsLearning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check online status
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setIsOnline(navigator.onLine)

        // 온라인/오프라인 상태 변경 감지
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
          window.removeEventListener("online", handleOnline)
          window.removeEventListener("offline", handleOffline)
        }
      } catch (err) {
        console.error("Failed to initialize:", err)
      }
    }
  }, [])

  // 로컬 스토리지에서 메시지 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMessages = localStorage.getItem("ai-chat-messages")
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages)
          // 날짜 문자열을 Date 객체로 변환
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
          setMessages(messagesWithDates)
        }
      } catch (err) {
        console.error("Failed to parse saved messages:", err)
      }
    }
  }, [])

  // 메시지 저장
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        localStorage.setItem("ai-chat-messages", JSON.stringify(messages))
      } catch (err) {
        console.error("Failed to save messages:", err)
      }
    }
  }, [messages])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate background learning
  useEffect(() => {
    const learningInterval = setInterval(() => {
      // Simulate background learning every 5 minutes
      if (!unifiedLearningSystem.isLearning && messages.length > 1) {
        triggerBackgroundLearning()
      }

      // Update UI if learning is in progress
      if (unifiedLearningSystem.isLearning) {
        setLearningProgress(unifiedLearningSystem.progress)
        setIsLearning(true)
      } else {
        setIsLearning(false)
      }
    }, 5000) // Check every 5 seconds (in a real app, learning would be less frequent)

    return () => clearInterval(learningInterval)
  }, [messages])

  const triggerBackgroundLearning = () => {
    unifiedLearningSystem.startLearning()
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Simulate thought process for debug mode
      if (debugMode) {
        simulateThoughtProcess(input)
      }

      // 오프라인 모드 처리
      if (!isOnline && useWebSearch) {
        // 오프라인 상태에서 웹 검색 기능 비활성화
        const offlineMessage = {
          role: "system",
          content: "현재 오프라인 상태입니다. 웹 검색 기능은 인터넷 연결이 필요합니다.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, offlineMessage])
        setIsLoading(false)
        return
      }

      // Simulate AI processing with different capabilities
      await simulateProcessing()

      // Generate AI response
      const aiResponse = await generateResponse(input)

      // Add AI message
      const assistantMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Trigger learning from this interaction
      if (useNeuralNetwork) {
        triggerBackgroundLearning()
      }
    } catch (err) {
      console.error("Error processing message:", err)
      setError("메시지 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const simulateProcessing = async () => {
    // Simulate processing time based on enabled features
    const baseTime = 500
    let processingTime = baseTime

    if (useWebSearch && isOnline) processingTime += 800
    if (useNeuralNetwork) processingTime += 600
    if (useDatabase) processingTime += 300

    // Add some randomness
    processingTime += Math.random() * 500

    return new Promise((resolve) => setTimeout(resolve, processingTime))
  }

  const simulateThoughtProcess = (query: string) => {
    const thoughts = [
      `입력 분석 중: "${query}"`,
      "질문 유형 분류 중...",
      useWebSearch && isOnline ? "관련 정보 웹 검색 중..." : "",
      useDatabase ? "기존 응답 데이터베이스 검색 중..." : "",
      useNeuralNetwork ? "신경망 모델 활성화 중..." : "",
      "응답 생성 중...",
      `창의성 수준 적용 중: ${creativityLevel[0]}%`,
      "최종 응답 구성 중...",
    ].filter(Boolean)

    setThoughtProcess([])

    thoughts.forEach((thought, index) => {
      setTimeout(() => {
        setThoughtProcess((prev) => [...prev, thought])
      }, index * 400)
    })
  }

  const generateResponse = async (query: string) => {
    // This would normally call an actual AI model
    // For now, we'll return simulated responses

    // Simple response templates based on query keywords
    if (query.includes("안녕") || query.includes("반가워")) {
      return "안녕하세요! 오늘 무엇을 도와드릴까요?"
    }

    if (query.includes("기능") || query.includes("할 수 있")) {
      return "저는 통합 AI 플랫폼으로, 웹 검색, 신경망 처리, 데이터베이스 활용, 자가 학습 등의 기능을 갖추고 있습니다. 질문에 답변하거나, 정보를 찾거나, 창의적인 콘텐츠를 생성할 수 있습니다."
    }

    if (query.includes("학습") || query.includes("배우")) {
      return "저는 지속적인 자가 학습 시스템을 통해 모든 상호작용에서 학습합니다. 사용자의 질문과 피드백을 분석하여 패턴을 인식하고, 지식 베이스를 확장하며, 응답의 품질을 향상시킵니다. 백그라운드에서 주기적으로 학습 프로세스가 실행됩니다."
    }

    if (query.includes("검색") || query.includes("찾아")) {
      return "웹 검색 기능이 활성화되어 있어 최신 정보를 찾아 응답에 통합할 수 있습니다. 검색 결과는 관련성과 신뢰성을 기준으로 필터링되며, 출처와 함께 제공됩니다."
    }

    if (query.includes("신경망") || query.includes("인공지능")) {
      return "신경망 기술을 활용하여 패턴을 인식하고, 복잡한 질문을 이해하며, 맥락에 맞는 응답을 생성합니다. 창의성 수준을 조절하여 다양한 스타일의 응답을 생성할 수 있습니다."
    }

    if (query.includes("데이터베이스") || query.includes("저장")) {
      return "모든 질문과 응답은 데이터베이스에 저장되어 유사한 질문에 대한 이전 응답을 활용하고, 지속적으로 지식 베이스를 확장합니다. 이를 통해 시간이 지날수록 더 정확하고 유용한 응답을 제공할 수 있습니다."
    }

    if (query.includes("오프라인") || query.includes("인터넷")) {
      return "오프라인 모드에서도 기본적인 대화 기능과 이전에 학습한 내용을 바탕으로 응답할 수 있습니다. 다만, 웹 검색 등 인터넷 연결이 필요한 기능은 제한됩니다."
    }

    // Default response with some randomness based on creativity level
    const responses = [
      "질문해주셔서 감사합니다. 제가 도움이 필요하신 부분을 좀 더 자세히 알려주시겠어요?",
      "흥미로운 질문입니다. 좀 더 구체적인 정보를 주시면 더 정확한 답변을 드릴 수 있을 것 같습니다.",
      "말씀하신 내용에 대해 더 알아보고 싶습니다. 추가 정보를 제공해주시겠어요?",
      "질문을 분석해보니 여러 측면에서 접근할 수 있을 것 같습니다. 어떤 관점에서 답변을 원하시나요?",
      "이 주제에 대해 더 깊이 탐구해볼 수 있을 것 같습니다. 특별히 알고 싶으신 부분이 있으신가요?",
    ]

    // Select response based on creativity level
    const randomIndex = Math.floor((creativityLevel[0] / 100) * responses.length)
    return responses[Math.min(randomIndex, responses.length - 1)]
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // 대화 내용 내보내기
  const exportChat = () => {
    if (messages.length <= 1) return // 시스템 메시지만 있는 경우 내보내기 안 함

    try {
      const chatText = messages
        .map((msg) => {
          const role = msg.role === "user" ? "사용자" : msg.role === "system" ? "시스템" : "AI 어시스턴트"
          const time = formatTimestamp(msg.timestamp)
          return `[${time}] ${role}: ${msg.content}`
        })
        .join("\n\n")

      const blob = new Blob([chatText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `AI-대화-${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to export chat:", err)
      setError("대화 내용을 내보내는 중 오류가 발생했습니다.")
    }
  }

  // 대화 내용 공유
  const shareChat = async () => {
    if (messages.length <= 1 || typeof navigator === "undefined" || !navigator.share) return

    try {
      const chatText = messages
        .map((msg) => {
          const role = msg.role === "user" ? "사용자" : msg.role === "system" ? "시스템" : "AI 어시스턴트"
          return `${role}: ${msg.content}`
        })
        .join("\n\n")

      await navigator.share({
        title: "AI 대화 내용",
        text: chatText,
      })
    } catch (err) {
      console.error("공유 실패:", err)
      setError("대화 내용을 공유하는 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="w-full space-y-4">
      {!isOnline && (
        <Alert variant="destructive" className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>오프라인 모드</AlertTitle>
          <AlertDescription>인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI 채팅</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>디버그</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>학습</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="w-full">
            <CardContent className="p-4">
              <ScrollArea className="h-[450px] pr-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="mb-1">
                          <span className="font-medium">
                            {message.role === "user"
                              ? "사용자"
                              : message.role === "system"
                                ? "시스템"
                                : "AI 어시스턴트"}
                          </span>
                          <span className="text-xs ml-2 opacity-70">{formatTimestamp(message.timestamp)}</span>
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>AI가 응답을 생성하는 중...</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {error && (
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="메시지를 입력하세요..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="flex items-center gap-1"
                >
                  <Send className="h-4 w-4" />
                  <span>전송</span>
                </Button>
              </div>
              <div className="flex justify-between w-full text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  {useWebSearch && (
                    <Badge variant="outline" className={`flex items-center gap-1 ${!isOnline ? "opacity-50" : ""}`}>
                      <Search className="h-3 w-3" /> 웹 검색 {!isOnline && "(오프라인)"}
                    </Badge>
                  )}
                  {useNeuralNetwork && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Network className="h-3 w-3" /> 신경망
                    </Badge>
                  )}
                  {useDatabase && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Database className="h-3 w-3" /> 데이터베이스
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={exportChat}
                        className="h-6 w-6"
                        title="대화 내보내기"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {typeof navigator !== "undefined" && navigator.share && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={shareChat}
                          className="h-6 w-6"
                          title="대화 공유하기"
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                      )}
                    </>
                  )}
                  {isLearning && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50">
                      <Zap className="h-3 w-3 text-yellow-500" /> 학습 중...
                    </Badge>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>AI 설정</CardTitle>
              <CardDescription>통합 AI 플랫폼의 기능과 동작을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="web-search">웹 검색</Label>
                    <p className="text-sm text-muted-foreground">
                      질문에 답하기 위해 웹 검색을 사용합니다.
                      {!isOnline && <span className="text-red-500 ml-1">(오프라인 상태에서는 사용할 수 없음)</span>}
                    </p>
                  </div>
                  <Switch
                    id="web-search"
                    checked={useWebSearch}
                    onCheckedChange={setUseWebSearch}
                    disabled={!isOnline}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="neural-network">신경망 활용</Label>
                    <p className="text-sm text-muted-foreground">패턴 인식과 고급 처리를 위한 신경망을 활용합니다.</p>
                  </div>
                  <Switch id="neural-network" checked={useNeuralNetwork} onCheckedChange={setUseNeuralNetwork} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="database">데이터베이스 활용</Label>
                    <p className="text-sm text-muted-foreground">이전 대화를 저장하고 학습에 활용합니다.</p>
                  </div>
                  <Switch id="database" checked={useDatabase} onCheckedChange={setUseDatabase} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="creativity">창의성 수준: {creativityLevel[0]}%</Label>
                    <Badge variant="outline">
                      {creativityLevel[0] < 30 ? "보수적" : creativityLevel[0] < 70 ? "균형적" : "창의적"}
                    </Badge>
                  </div>
                  <Slider
                    id="creativity"
                    min={0}
                    max={100}
                    step={1}
                    value={creativityLevel}
                    onValueChange={setCreativityLevel}
                  />
                  <p className="text-xs text-muted-foreground">
                    낮은 값은 보수적이고 사실적인 응답을, 높은 값은 더 창의적이고 다양한 응답을 생성합니다.
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">디버그 모드</Label>
                    <p className="text-sm text-muted-foreground">AI의 사고 과정을 시각화합니다.</p>
                  </div>
                  <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug">
          <Card>
            <CardHeader>
              <CardTitle>AI 디버그 정보</CardTitle>
              <CardDescription>AI의 내부 작동 방식과 사고 과정을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">활성화된 기능</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={useWebSearch ? "default" : "outline"}
                    className={`flex items-center gap-1 ${!isOnline && useWebSearch ? "opacity-50" : ""}`}
                  >
                    <Search className="h-3 w-3" /> 웹 검색 {!isOnline && useWebSearch && "(오프라인)"}
                  </Badge>
                  <Badge variant={useNeuralNetwork ? "default" : "outline"} className="flex items-center gap-1">
                    <Network className="h-3 w-3" /> 신경망
                  </Badge>
                  <Badge variant={useDatabase ? "default" : "outline"} className="flex items-center gap-1">
                    <Database className="h-3 w-3" /> 데이터베이스
                  </Badge>
                  <Badge variant={debugMode ? "default" : "outline"} className="flex items-center gap-1">
                    <Info className="h-3 w-3" /> 디버그 모드
                  </Badge>
                  <Badge variant={isLearning ? "default" : "outline"} className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" /> 학습 중
                  </Badge>
                  <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                    {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}{" "}
                    {isOnline ? "온라인" : "오프라인"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">AI 사고 과정</h3>
                {thoughtProcess.length > 0 ? (
                  <div className="space-y-2 p-3 bg-muted rounded-md">
                    {thoughtProcess.map((thought, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{thought}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 사고 과정이 기록되지 않았습니다. 메시지를 보내면 AI의 사고 과정이 여기에 표시됩니다.
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">시스템 상태</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">창의성 수준</div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <div className="text-sm font-medium">{creativityLevel[0]}%</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">메시지 수</div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-500" />
                      <div className="text-sm font-medium">{messages.length}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">학습 상태</div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className={`h-4 w-4 ${isLearning ? "text-yellow-500" : "text-muted-foreground"}`} />
                      <div className="text-sm font-medium">
                        {isLearning ? `학습 중 (${learningProgress}%)` : "대기 중"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">마지막 학습</div>
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-purple-500" />
                      <div className="text-sm font-medium">
                        {unifiedLearningSystem.lastLearned
                          ? unifiedLearningSystem.lastLearned.toLocaleTimeString()
                          : "없음"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>자가 학습 시스템</CardTitle>
              <CardDescription>AI의 학습 상태와 진행 상황을 확인하고 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">학습 상태</h3>
                  <Badge variant={isLearning ? "default" : "secondary"}>{isLearning ? "학습 중" : "대기 중"}</Badge>
                </div>

                {isLearning && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>진행률</span>
                      <span>{learningProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${learningProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  {isLearning
                    ? "현재 대화 데이터를 분석하고 패턴을 학습하는 중입니다."
                    : "학습 시스템이 대기 중입니다. 새로운 대화가 발생하면 자동으로 학습을 시작합니다."}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">학습 설정</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-learning">자동 학습</Label>
                    <p className="text-sm text-muted-foreground">백그라운드에서 자동으로 학습을 수행합니다.</p>
                  </div>
                  <Switch id="auto-learning" checked={true} disabled />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="learning-interval">학습 주기</Label>
                    <p className="text-sm text-muted-foreground">자동 학습이 실행되는 주기를 설정합니다.</p>
                  </div>
                  <Select disabled value="5">
                    <option value="5">5분</option>
                    <option value="15">15분</option>
                    <option value="30">30분</option>
                    <option value="60">1시간</option>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">학습 데이터</h3>
                <p className="text-sm text-muted-foreground">
                  현재 {messages.length - 1}개의 메시지가 학습 데이터로 사용 가능합니다.
                </p>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={triggerBackgroundLearning}
                    disabled={isLearning || messages.length <= 1}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    지금 학습 시작
                  </Button>

                  <Button variant="outline" disabled>
                    <Database className="h-4 w-4 mr-2" />
                    학습 데이터 관리
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">학습 로그</h3>
                <Textarea
                  readOnly
                  className="font-mono text-xs h-[100px]"
                  value={`[${new Date().toLocaleTimeString()}] 학습 시스템 초기화 완료
[${new Date(Date.now() - 120000).toLocaleTimeString()}] 자동 학습 스케줄러 시작됨
[${new Date(Date.now() - 60000).toLocaleTimeString()}] 대화 데이터 분석 중
${unifiedLearningSystem.lastLearned ? `[${unifiedLearningSystem.lastLearned.toLocaleTimeString()}] 학습 완료 (패턴 5개 발견)` : ""}`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Placeholder for Select component since it's not imported
function Select({ children, disabled, value }: { children: React.ReactNode; disabled?: boolean; value: string }) {
  return (
    <select className="border rounded-md px-3 py-1 bg-background" disabled={disabled} value={value}>
      {children}
    </select>
  )
}
