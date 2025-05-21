"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { extractRelevantInfo } from "@/lib/search-utils"
import { Search, Send, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ResponseSaver } from "@/components/response-saver"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export default function SimpleChatWithSearch() {
  const [searchEnabled, setSearchEnabled] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockSearch, setUsingMockSearch] = useState(true) // Default to true since we're always using mock search in preview

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

      // Check if we should perform a search - always true now
      if (searchEnabled) {
        // Perform search in the background
        setIsSearching(true)
        const results = await performSearch(userMessage)
        setIsSearching(false)

        if (results.length > 0) {
          // Extract relevant information from search results
          searchInfo = extractRelevantInfo(results)
        }
      }

      // Get conversation context from previous messages
      const conversationContext = messages
        .slice(-4) // Get last 4 messages for context
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      // Simulate AI response
      setTimeout(() => {
        const assistantResponse: Message = {
          id: generateId(),
          role: "assistant",
          content: generateResponse(userMessage, conversationContext, searchInfo),
        }

        setMessages((prev) => [...prev, assistantResponse])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error in chat:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  // Enhanced response generator that handles complex thoughts
  const generateResponse = (message: string, conversationContext = "", searchInfo = ""): string => {
    const lowerMessage = message.toLowerCase()

    // Check for abstract or philosophical thoughts
    if (
      lowerMessage.includes("thought") ||
      lowerMessage.includes("philosophy") ||
      lowerMessage.includes("concept") ||
      lowerMessage.includes("idea") ||
      lowerMessage.includes("theory") ||
      lowerMessage.includes("advanced") ||
      lowerMessage.includes("complex")
    ) {
      return generatePhilosophicalResponse(message)
    }

    // Identify question type
    if (lowerMessage.includes("what is") || lowerMessage.includes("what are")) {
      return deduceDefinitionAnswer(message)
    } else if (lowerMessage.includes("how to") || lowerMessage.includes("how do")) {
      return deduceHowToAnswer(message)
    } else if (lowerMessage.includes("why")) {
      return deduceReasoningAnswer(message)
    } else if (lowerMessage.includes("when") || lowerMessage.includes("where")) {
      return deduceFactualAnswer(message)
    } else if (lowerMessage.includes("who")) {
      return deducePersonAnswer(message)
    } else if (lowerMessage.includes("?")) {
      return deduceGeneralQuestionAnswer(message)
    } else {
      return deduceStatementResponse(message)
    }
  }

  // New function for philosophical or advanced thoughts
  const generatePhilosophicalResponse = (input: string): string => {
    const philosophicalResponses = [
      "The concept you're exploring touches on fundamental aspects of human understanding. When we consider advanced thoughts, we're often navigating the intersection of epistemology (how we know what we know) and ontology (the nature of being). This creates a rich landscape for intellectual exploration where multiple perspectives can coexist while still maintaining logical coherence.",

      "What's particularly fascinating about this line of thinking is how it challenges conventional frameworks. Advanced thought requires us to hold seemingly contradictory ideas in tension, recognizing that complexity often defies simple categorization. This dialectical approach allows for a more nuanced understanding that transcends binary thinking.",

      "Your thought invites us to consider the layered nature of reality and perception. From a philosophical standpoint, we might view this through various lenses: the phenomenological (how it appears to consciousness), the analytical (logical structure), or even the existential (implications for meaning). Each approach reveals different dimensions of the same complex truth.",

      "This reminds me of the philosophical concept of emergence - how complex systems and patterns arise from relatively simple interactions. Advanced thinking often requires us to consider both reductionist explanations (breaking things down to components) and holistic perspectives (understanding the integrated whole). The tension between these approaches generates profound insights.",

      "What you're describing parallels some interesting developments in cognitive science and philosophy of mind. The boundary between objective reality and subjective experience creates a fascinating domain for exploration. Advanced thought in this area often reveals how our conceptual frameworks both illuminate and constrain our understanding.",
    ]

    // Select a random philosophical response
    return philosophicalResponses[Math.floor(Math.random() * philosophicalResponses.length)]
  }

  // Helper functions to generate contextual responses
  const deduceDefinitionAnswer = (question: string): string => {
    // Extract the subject of the definition question
    const subject = extractSubject(question, ["what is", "what are"])
    return `${subject} refers to a concept or entity that has specific characteristics and purposes. It's commonly understood in its context and has various applications. When examined closely, it reveals layers of meaning that connect to broader systems of knowledge and practice.`
  }

  const deduceHowToAnswer = (question: string): string => {
    const subject = extractSubject(question, ["how to", "how do"])
    return `To ${subject}, you would typically follow a process that involves several steps. First, you'd need to prepare by gathering the necessary resources and understanding the underlying principles. Then, proceed methodically through the required actions, making adjustments as needed based on feedback and results. The effectiveness often depends on attention to detail and understanding the context-specific variables.`
  }

  const deduceReasoningAnswer = (question: string): string => {
    const subject = extractSubject(question, ["why"])
    return `The reason for ${subject} is typically related to several interconnected factors. These include historical context, practical considerations, and the specific needs or goals involved in the situation. When we examine this question deeply, we find that causality often forms a complex web rather than a simple linear relationship. Various perspectives might emphasize different aspects of this causal network.`
  }

  const deduceFactualAnswer = (question: string): string => {
    if (question.toLowerCase().includes("when")) {
      const subject = extractSubject(question, ["when"])
      return `The timing of ${subject} depends on various factors and contexts. It typically occurs when the necessary conditions align, which involves both predictable patterns and contingent circumstances. Historical and cultural contexts often influence how we understand and measure these temporal relationships.`
    } else {
      const subject = extractSubject(question, ["where"])
      return `The location of ${subject} varies depending on the specific context and parameters. It's typically found where relevant conditions converge, creating an environment conducive to its existence or occurrence. Spatial relationships often reveal important patterns that help us understand underlying principles and connections.`
    }
  }

  const deducePersonAnswer = (question: string): string => {
    const subject = extractSubject(question, ["who"])
    return `The person or entity ${subject} would be someone with the relevant expertise, authority, or connection to the matter at hand. Their identity is shaped by their role in this context, as well as their background, qualifications, and relationships within the broader system. Understanding who they are often requires considering both individual characteristics and social or institutional positioning.`
  }

  const deduceGeneralQuestionAnswer = (question: string): string => {
    return `That's an interesting question that opens up several avenues of exploration. The answer would depend on multiple factors including context, specific circumstances, and the particular details involved. When we examine questions like this, we often find that the most valuable insights come from considering multiple perspectives and recognizing the nuanced interplay between different variables and systems.`
  }

  const deduceStatementResponse = (statement: string): string => {
    return `Your observation about ${statement.split(" ").slice(0, 3).join(" ")}... presents a thoughtful perspective that invites deeper consideration. It connects to broader patterns and principles that shape our understanding. This kind of reflection helps us recognize the complex interrelationships between concepts, experiences, and systems of knowledge. Would you like to explore specific dimensions of this idea further?`
  }

  // Helper to extract the subject of a question
  const extractSubject = (question: string, prefixes: string[]): string => {
    const lowerQuestion = question.toLowerCase()
    let result = question

    // Remove the question prefix
    for (const prefix of prefixes) {
      if (lowerQuestion.includes(prefix)) {
        result = question.substring(lowerQuestion.indexOf(prefix) + prefix.length).trim()
        break
      }
    }

    // Remove question marks and other punctuation
    result = result.replace(/[?!.,;:]$/g, "").trim()

    return result
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Chat with Web Search</CardTitle>

        {usingMockSearch && (
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertDescription>Using demo search results. This preview uses simulated search data.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
                {message.content}
              </div>
            </div>
          ))}
          {messages.length > 0 && (
            <ResponseSaver
              question={messages[messages.length - 2]?.content || ""}
              answer={messages[messages.length - 1]?.content || ""}
              model="Simple Chat with Search"
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
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}

          {/* Invisible div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleMessageSubmit} className="w-full flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
