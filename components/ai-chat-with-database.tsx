"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { extractRelevantInfo } from "@/lib/search-utils"
import { Search, Send, AlertTriangle, Info, ThumbsUp, ThumbsDown, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import database functions
import { saveInteraction, addFeedback, findSimilarResponses } from "@/database/utils"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  feedback?: "positive" | "negative"
}

export default function AIChatWithDatabase() {
  const [searchEnabled, setSearchEnabled] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockSearch, setUsingMockSearch] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const [databaseEnabled, setDatabaseEnabled] = useState(true)
  const [similarResponses, setSimilarResponses] = useState<any[]>([])

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 10)

  const performSearch = async (query: string) => {
    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error("Search failed. Using mock results instead.")
      }

      const data = await response.json()

      // Check if we're using mock results
      if (data.usingMockResults) {
        setUsingMockSearch(true)
      }

      if (data.items && Array.isArray(data.items)) {
        return data.items
      }

      return []
    } catch (error) {
      console.error("Search error:", error)
      // Don't show search errors to the user, just log them
      return []
    } finally {
      setIsSearching(false)
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    // Store the current input
    const userMessage = input
    setInput("")

    // Add user message to chat
    const userMessageObj: Message = {
      id: generateId(),
      role: "user",
      content: userMessage,
    }

    setMessages((prev) => [...prev, userMessageObj])
    setIsLoading(true)
    setError(null)

    try {
      // Initialize searchInfo outside the conditional block
      let searchInfo = ""
      let searchResults = []

      // Check if we should perform a search
      if (searchEnabled) {
        // Perform search in the background
        setIsSearching(true)
        const results = await performSearch(userMessage)
        setIsSearching(false)

        if (results.length > 0) {
          // Extract relevant information from search results
          searchInfo = extractRelevantInfo(results)
          searchResults = results
        }
      }

      // Find similar responses from database if enabled
      if (databaseEnabled) {
        const similar = findSimilarResponses(userMessage)
        setSimilarResponses(similar)
      } else {
        setSimilarResponses([])
      }

      // Get conversation context from previous messages
      const conversationContext = messages
        .slice(-4) // Get last 4 messages for context
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      // Generate AI response
      setTimeout(() => {
        const responseContent = generateResponse(userMessage, conversationContext, searchInfo, similarResponses)

        const responseId = generateId()

        const assistantResponse: Message = {
          id: responseId,
          role: "assistant",
          content: responseContent,
        }

        setMessages((prev) => [...prev, assistantResponse])
        setIsLoading(false)

        // Save interaction to database if enabled
        if (databaseEnabled) {
          saveInteraction(userMessage, responseContent, "gpt-2", searchResults)
        }
      }, 1000)
    } catch (error) {
      console.error("Error in chat:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  // Generate a response based on the input and context
  const generateResponse = (
    message: string,
    conversationContext = "",
    searchInfo = "",
    similarResponses: any[] = [],
  ): string => {
    // If we have similar responses from the database, use the most relevant one
    if (similarResponses.length > 0) {
      return `Based on similar questions in our database: ${similarResponses[0].response}`
    }

    // If we have search results, incorporate them
    if (searchInfo) {
      return `Based on web search results: ${searchInfo}\n\nThis information should help answer your question about ${message}.`
    }

    // Otherwise, generate a generic response
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("what is") || lowerMessage.includes("what are")) {
      return `${message.substring(8)} refers to a concept or entity that has specific characteristics and purposes. It's commonly understood in its context and has various applications.`
    } else if (lowerMessage.includes("how to") || lowerMessage.includes("how do")) {
      return `To ${message.substring(7)}, you would typically follow a process that involves several steps. First, you'd need to prepare by gathering the necessary resources. Then, proceed methodically through the required actions.`
    } else if (lowerMessage.includes("why")) {
      return `The reason for ${message.substring(4)} is typically related to several interconnected factors. These include historical context, practical considerations, and the specific needs or goals involved in the situation.`
    } else if (lowerMessage.includes("when") || lowerMessage.includes("where")) {
      return `That depends on various factors and contexts. It typically occurs when the necessary conditions align, which involves both predictable patterns and contingent circumstances.`
    } else if (lowerMessage.includes("who")) {
      return `The person or entity ${message.substring(4)} would be someone with the relevant expertise, authority, or connection to the matter at hand.`
    } else if (lowerMessage.includes("?")) {
      return `That's an interesting question that opens up several avenues of exploration. The answer would depend on multiple factors including context, specific circumstances, and the particular details involved.`
    } else {
      return `Your observation about ${message.split(" ").slice(0, 3).join(" ")}... presents a thoughtful perspective that invites deeper consideration. Would you like to explore specific dimensions of this idea further?`
    }
  }

  // Handle feedback for a message
  const handleFeedback = (messageId: string, feedbackType: "positive" | "negative") => {
    // Update the message with feedback
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: feedbackType } : msg)))

    // Record feedback in database if enabled
    if (databaseEnabled) {
      addFeedback({
        responseId: messageId,
        rating: feedbackType === "positive" ? "helpful" : "not_helpful",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI 챗봇 (데이터베이스 통합)</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={databaseEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setDatabaseEnabled(!databaseEnabled)}
            >
              <Database className="h-4 w-4 mr-2" />
              {databaseEnabled ? "DB 사용 중" : "DB 사용 안함"}
            </Button>
          </div>
        </div>
        <CardDescription>질문에 답변하고 응답을 데이터베이스에 저장합니다</CardDescription>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="chat">채팅</TabsTrigger>
            <TabsTrigger value="similar">유사 응답</TabsTrigger>
          </TabsList>
        </Tabs>

        {usingMockSearch && activeTab === "chat" && (
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertDescription>
              데모 검색 결과를 사용합니다. 이 미리보기는 시뮬레이션된 검색 데이터를 사용합니다.
            </AlertDescription>
          </Alert>
        )}

        {error && activeTab === "chat" && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <TabsContent value="chat" className="mt-0">
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "mb-4",
                  message.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start",
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "system"
                        ? "bg-muted text-muted-foreground text-xs italic"
                        : "bg-muted text-card-foreground border",
                  )}
                >
                  {message.role === "system" && <Search className="h-3 w-3 inline mr-1" />}
                  {message.content}
                </div>

                {/* Feedback buttons for assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex mt-1 space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("h-6 px-2", message.feedback === "positive" && "bg-green-100 text-green-700")}
                      onClick={() => handleFeedback(message.id, "positive")}
                      disabled={message.feedback !== undefined}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">도움됨</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("h-6 px-2", message.feedback === "negative" && "bg-red-100 text-red-700")}
                      onClick={() => handleFeedback(message.id, "negative")}
                      disabled={message.feedback !== undefined}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      <span className="text-xs">도움 안됨</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isSearching && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm italic flex items-center">
                  <Search className="h-3 w-3 mr-2 animate-pulse" />웹 검색 중...
                </div>
              </div>
            )}

            {isLoading && !isSearching && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm italic flex items-center">
                  <div className="animate-pulse">생각 중...</div>
                </div>
              </div>
            )}

            {/* Invisible div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="similar" className="mt-0">
          <ScrollArea className="h-[400px] pr-4">
            {similarResponses.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">데이터베이스에서 찾은 유사한 응답:</h3>
                {similarResponses.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="mr-2">
                        질문
                      </Badge>
                      <span className="font-medium">{item.query}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{item.response}</div>
                    <div className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">유사한 응답 없음</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  현재 질문과 유사한 응답이 데이터베이스에 없습니다. 대화를 계속하면 응답이 데이터베이스에 저장되어 향후
                  유사한 질문에 활용됩니다.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleMessageSubmit} className="w-full flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력하세요..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">전송</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
