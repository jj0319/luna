/**
 * AI Chat Component with Search Integration
 *
 * This component provides a chat interface that uses local AI models
 * and integrates with Google search for enhanced responses.
 */

"use client"

import type React from "react"

import { useState, useRef, type FormEvent, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { extractRelevantInfo } from "@/lib/search-utils"
import { Search, Send, Globe, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { shouldPerformSearch, generateSearchQuery } from "@/lib/search-trigger"
import { ResponseSaver } from "@/components/response-saver"

// Types
type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export default function AIChatWithSearch() {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm an AI assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchEnabled, setSearchEnabled] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gpt2-medium")
  const [showModelWarning, setShowModelWarning] = useState(true)
  const [usingMockSearch, setUsingMockSearch] = useState(false)

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if Google API keys are available
  useEffect(() => {
    const checkSearchApi = async () => {
      try {
        const response = await fetch("/api/search/debug")
        const data = await response.json()

        if (response.ok) {
          // Update to use idSet instead of cxSet
          setUsingMockSearch(!data.diagnostics.apiKeySet || !data.diagnostics.idSet)
        } else {
          setUsingMockSearch(true)
        }
      } catch (error) {
        setUsingMockSearch(true)
      }
    }

    checkSearchApi()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 10)

  /**
   * Handles form submission for sending a message
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Store the current input and clear the input field
    const userMessage = input.trim()
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

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new abort controller
    abortControllerRef.current = new AbortController()

    try {
      // Check if we should perform a search
      if (searchEnabled && shouldPerformSearch(userMessage)) {
        setIsSearching(true)
        // Use the generateSearchQuery function to create a better search query
        const searchQuery = generateSearchQuery(userMessage)
        console.log(`Performing search with query: "${searchQuery}" (original: "${userMessage}")`)

        const results = await performSearch(searchQuery)
        setIsSearching(false)

        if (results.length > 0) {
          // Extract relevant information from search results
          const searchInfo = extractRelevantInfo(results)

          // Add system message with search results
          const systemMessageObj: Message = {
            id: generateId(),
            role: "system",
            content: `Here is relevant information from a web search: ${searchInfo}`,
          }

          setMessages((prev) => [...prev, systemMessageObj])
        } else {
          console.log("No search results found")
        }
      } else {
        console.log("Search not triggered for this message")
      }

      // Simulate AI response instead of using the actual API to avoid onnxruntime-web issues
      setTimeout(() => {
        const responses = [
          `I understand your question about "${userMessage}". Based on my knowledge, I can provide some insights on this topic.`,
          `Thank you for asking about "${userMessage}". This is an interesting topic with several aspects to consider.`,
          `Regarding "${userMessage}", I can share some information that might be helpful for your understanding.`,
          `I've analyzed your question about "${userMessage}" and can offer some perspectives on this matter.`,
          `Your inquiry about "${userMessage}" touches on important concepts. Let me explain what I know.`,
        ]

        const responseContent = responses[Math.floor(Math.random() * responses.length)]

        const assistantResponse: Message = {
          id: generateId(),
          role: "assistant",
          content: responseContent,
        }

        setMessages((prev) => [...prev, assistantResponse])
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error in chat:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      }
      setIsLoading(false)
    }
  }

  /**
   * Performs a search using the Google Custom Search API
   */
  const performSearch = async (query: string) => {
    try {
      console.log(`Sending search request for: ${query}`)
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)

      const data = await response.json()

      if (!response.ok) {
        console.error("Search failed:", data)
        // Still return empty results but log the error
        return []
      }

      if (data.items && Array.isArray(data.items)) {
        console.log(`Received ${data.items.length} search results`)
        return data.items
      } else {
        console.log("No items in search results:", data)
        return []
      }
    } catch (error) {
      console.error("Search error:", error)
      return []
    }
  }

  /**
   * Handles input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  /**
   * Handles model selection change
   */
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  /**
   * Stops the current generation
   */
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Chat with Web Search</span>
          <Button
            variant={searchEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchEnabled(!searchEnabled)}
          >
            <Globe className="h-4 w-4 mr-2" />
            {searchEnabled ? "Search Enabled" : "Search Disabled"}
          </Button>
        </CardTitle>

        {showModelWarning && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This is a simplified preview version. For full functionality, please download the models locally.
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => setShowModelWarning(false)}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {usingMockSearch && searchEnabled && (
          <Alert className="mt-4" variant="warning">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Using mock search results. For real search results, add GOOGLE_API_KEY and GOOGLE_ID environment
              variables.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("mb-4 flex", message.role === "user" ? "justify-end" : "justify-start")}
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
                {message.content || (message.role === "assistant" && isLoading ? "..." : "")}
              </div>
            </div>
          ))}

          {messages.length > 0 && (
            <ResponseSaver
              question={messages[messages.length - 2]?.content || ""}
              answer={messages[messages.length - 1]?.content || ""}
              model="AI with Search"
              category="검색 강화"
            />
          )}

          {isSearching && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm italic flex items-center">
                <Search className="h-3 w-3 mr-2 animate-pulse" />
                Searching the web...
              </div>
            </div>
          )}

          {isLoading && !isSearching && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm italic flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Invisible div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1"
          />
          {isLoading ? (
            <Button type="button" variant="destructive" onClick={handleStopGeneration}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          )}
        </form>
      </CardFooter>
    </Card>
  )
}
