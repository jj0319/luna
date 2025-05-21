"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, Send, Brain, BarChart2, RefreshCw } from "lucide-react"
import {
  recordInteraction,
  recordFeedback,
  predictResponseQuality,
  predictContentCategory,
  getNeuralLearningStats,
  trainNeuralNetworks,
  resetNeuralLearningStore,
  findRelevantKnowledge,
  getSimilarQueries,
} from "@/lib/neural-learning-store"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  feedback?: "positive" | "negative"
  quality?: number
  categories?: { category: string; confidence: number }[]
}

export default function NeuralSelfLearningChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [showQualityIndicators, setShowQualityIndicators] = useState(false)
  const [trainingStatus, setTrainingStatus] = useState<{
    isTraining: boolean
    responseQualityError?: number
    contentCategoryError?: number
  }>({
    isTraining: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load stats on mount
  useEffect(() => {
    setStats(getNeuralLearningStats())
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 10),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Get similar past queries
      const similarQueries = getSimilarQueries(userMessage.content)

      // Get relevant knowledge
      const relevantKnowledge = findRelevantKnowledge(userMessage.content)

      // Generate a response (in a real system, this would use an AI model)
      let response = ""

      if (similarQueries.length > 0) {
        // Use a similar past response
        response = `Based on similar questions I've seen before, I think this might help: ${similarQueries[0].response}`
      } else if (relevantKnowledge.length > 0) {
        // Use relevant knowledge
        response = `Here's what I know about this: ${relevantKnowledge[0].content}`
      } else {
        // Generate a generic response
        response = `I'm learning about "${userMessage.content}". As I learn more from our conversations, I'll be able to provide better answers.`
      }

      // Record the interaction for learning
      const responseId = recordInteraction(userMessage.content, response, ["neural-chat"])

      // Predict response quality
      const quality = predictResponseQuality(response)

      // Predict content categories
      const categories = predictContentCategory(response)

      // Add assistant message
      const assistantMessage: Message = {
        id: responseId,
        role: "assistant",
        content: response,
        timestamp: Date.now(),
        quality,
        categories,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update stats
      setStats(getNeuralLearningStats())
    } catch (error) {
      console.error("Error processing message:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    // Record feedback for learning
    recordFeedback(messageId, feedback)

    // Update message in UI
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))

    // Update stats
    setStats(getNeuralLearningStats())
  }

  const handleTrain = async () => {
    setTrainingStatus({ isTraining: true })

    try {
      const { responseQualityError, contentCategoryError } = await trainNeuralNetworks()

      setTrainingStatus({
        isTraining: false,
        responseQualityError,
        contentCategoryError,
      })

      // Update stats
      setStats(getNeuralLearningStats())
    } catch (error) {
      console.error("Error training networks:", error)
      setTrainingStatus({ isTraining: false })
    }
  }

  const handleReset = () => {
    if (window.confirm("정말로 모든 학습 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      resetNeuralLearningStore()
      setMessages([])
      setStats(getNeuralLearningStats())
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <Brain className="h-5 w-5 text-gray-600" />
          <span>자가 학습 AI</span>
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">대화를 통해 학습하고 발전하는 AI 시스템</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2 h-9 mb-2">
            <TabsTrigger value="chat" className="text-xs">
              대화
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              학습 통계
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="mt-0 pt-0">
          <CardContent className="p-3">
            <div className="space-y-3 h-[450px] overflow-y-auto mb-2 px-1">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">
                  대화를 시작하여 AI가 학습할 수 있도록 도와주세요.
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                        message.role === "user"
                          ? "bg-blue-50 text-gray-800 border border-blue-100"
                          : "bg-gray-50 text-gray-800 border border-gray-100"
                      }`}
                    >
                      <div>{message.content}</div>

                      {message.role === "assistant" && showQualityIndicators && (
                        <div className="mt-2 pt-1 border-t border-gray-100 flex flex-col gap-1">
                          {message.quality !== undefined && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              품질:
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    message.quality > 0.7
                                      ? "bg-green-400"
                                      : message.quality > 0.4
                                        ? "bg-yellow-400"
                                        : "bg-red-400"
                                  }`}
                                  style={{ width: `${message.quality * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {message.categories && message.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {message.categories.slice(0, 2).map((cat) => (
                                <Badge
                                  key={cat.category}
                                  variant="outline"
                                  className="text-[10px] py-0 h-4 font-normal text-gray-500 bg-gray-50"
                                >
                                  {cat.category}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-5 w-5 rounded-full ${
                              message.feedback === "positive" ? "text-green-500 bg-green-50" : "text-gray-400"
                            }`}
                            onClick={() => handleFeedback(message.id, "positive")}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-5 w-5 rounded-full ${
                              message.feedback === "negative" ? "text-red-500 bg-red-50" : "text-gray-400"
                            }`}
                            onClick={() => handleFeedback(message.id, "negative")}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="w-full space-y-2">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  disabled={isProcessing}
                  className="text-sm"
                />
                <Button type="submit" disabled={isProcessing} size="sm" className="px-3">
                  {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>

              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 h-7 px-2"
                  onClick={() => setShowQualityIndicators(!showQualityIndicators)}
                >
                  {showQualityIndicators ? "품질 지표 숨기기" : "품질 지표 표시"}
                </Button>

                <div className="text-xs text-gray-400">{stats?.totalInteractions || 0}개의 대화 기록</div>
              </div>
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent value="stats" className="mt-0 pt-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">총 상호작용</div>
                  <div className="text-xl font-medium text-gray-800">{stats?.totalInteractions || 0}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">지식 항목</div>
                  <div className="text-xl font-medium text-gray-800">{stats?.knowledgeItems || 0}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">긍정적 피드백</div>
                  <div className="text-xl font-medium text-green-600">{stats?.positiveFeedback || 0}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">부정적 피드백</div>
                  <div className="text-xl font-medium text-red-600">{stats?.negativeFeedback || 0}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">신경망 상태</h3>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2">응답 품질 신경망</div>
                    {stats?.neuralNetworks?.responseQuality ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>아키텍처: {stats.neuralNetworks.responseQuality.architecture}</div>
                        <div>학습 예제: {stats.neuralNetworks.responseQuality.trainingExamples}</div>
                        {trainingStatus.responseQualityError !== undefined && (
                          <div>최근 오차: {trainingStatus.responseQualityError.toFixed(4)}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">초기화되지 않음</div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2">콘텐츠 분류 신경망</div>
                    {stats?.neuralNetworks?.contentCategory ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>아키텍처: {stats.neuralNetworks.contentCategory.architecture}</div>
                        <div>학습 예제: {stats.neuralNetworks.contentCategory.trainingExamples}</div>
                        {trainingStatus.contentCategoryError !== undefined && (
                          <div>최근 오차: {trainingStatus.contentCategoryError.toFixed(4)}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">초기화되지 않음</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    onClick={handleTrain}
                    disabled={trainingStatus.isTraining || !stats?.totalInteractions}
                    size="sm"
                    className="text-xs"
                  >
                    {trainingStatus.isTraining ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        학습 중...
                      </>
                    ) : (
                      <>
                        <BarChart2 className="h-3 w-3 mr-1" />
                        신경망 학습
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs text-red-500 border-red-200 hover:bg-red-50"
                  >
                    학습 데이터 초기화
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
