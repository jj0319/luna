"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { extractRelevantInfo } from "@/lib/search-utils"
import { Search, Send, AlertTriangle, Info, ThumbsUp, ThumbsDown, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  recordInteraction,
  recordFeedback,
  findRelevantKnowledge,
  getSimilarQueries,
  getLearningStats,
  resetLearningStore,
  type KnowledgeItem,
} from "@/lib/learning-store"
import { ResponseSaver } from "@/components/response-saver"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  feedback?: "positive" | "negative"
}

export default function SelfLearningChat() {
  const [searchEnabled, setSearchEnabled] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockSearch, setUsingMockSearch] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const [learningStats, setLearningStats] = useState({
    totalInteractions: 0,
    knowledgeItems: 0,
    positiveFeedback: 0,
    negativeFeedback: 0,
    topTags: [] as { tag: string; count: number }[],
  })
  const [learningEnabled, setLearningEnabled] = useState(true)

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Update learning stats periodically
  useEffect(() => {
    const updateStats = () => {
      setLearningStats(getLearningStats())
    }

    // Update stats initially
    updateStats()

    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000)

    return () => clearInterval(interval)
  }, [])

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

      // Check if we should perform a search
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

      // Get relevant knowledge from learning store
      let relevantKnowledge: KnowledgeItem[] = []
      if (learningEnabled) {
        relevantKnowledge = findRelevantKnowledge(userMessage)
      }

      // Get similar past queries
      const similarQueries = learningEnabled ? getSimilarQueries(userMessage) : []

      // Generate tags for this interaction
      const tags = generateTags(userMessage)

      // Simulate AI response
      setTimeout(() => {
        const responseContent = generateResponse(
          userMessage,
          conversationContext,
          searchInfo,
          relevantKnowledge,
          similarQueries,
        )

        const responseId = generateId()

        const assistantResponse: Message = {
          id: responseId,
          role: "assistant",
          content: responseContent,
        }

        setMessages((prev) => [...prev, assistantResponse])
        setIsLoading(false)

        // Record this interaction for learning if enabled
        if (learningEnabled) {
          recordInteraction(userMessage, responseContent, tags)
        }

        // Update learning stats
        setLearningStats(getLearningStats())
      }, 1000)
    } catch (error) {
      console.error("Error in chat:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  // Generate tags for categorizing the interaction
  const generateTags = (message: string): string[] => {
    const tags: string[] = []
    const lowerMessage = message.toLowerCase()

    // Add tags based on message content
    if (lowerMessage.includes("what") || lowerMessage.includes("define") || lowerMessage.includes("explain")) {
      tags.push("definition")
    }

    if (lowerMessage.includes("how") || lowerMessage.includes("steps") || lowerMessage.includes("process")) {
      tags.push("how-to")
    }

    if (lowerMessage.includes("why") || lowerMessage.includes("reason")) {
      tags.push("reasoning")
    }

    if (lowerMessage.includes("when") || lowerMessage.includes("time") || lowerMessage.includes("date")) {
      tags.push("temporal")
    }

    if (lowerMessage.includes("where") || lowerMessage.includes("location") || lowerMessage.includes("place")) {
      tags.push("location")
    }

    if (lowerMessage.includes("who") || lowerMessage.includes("person") || lowerMessage.includes("people")) {
      tags.push("person")
    }

    if (lowerMessage.includes("thought") || lowerMessage.includes("philosophy") || lowerMessage.includes("concept")) {
      tags.push("philosophical")
    }

    // Add a general tag if no specific tags were added
    if (tags.length === 0) {
      tags.push("general")
    }

    return tags
  }

  // Enhanced response generator that uses learned knowledge
  const generateResponse = (
    message: string,
    conversationContext = "",
    searchInfo = "",
    relevantKnowledge: KnowledgeItem[] = [],
    similarQueries: any[] = [],
  ): string => {
    const lowerMessage = message.toLowerCase()

    // First, check if we have relevant knowledge to use
    if (relevantKnowledge.length > 0) {
      // Use the most relevant knowledge item
      const knowledge = relevantKnowledge[0]

      // Incorporate the knowledge into the response
      return `Based on what I've learned, ${knowledge.content} This insight is relevant to your question about ${extractSubject(message, ["what", "how", "why", "when", "where", "who"])}.`
    }

    // If we have similar past queries, use them to inform the response
    if (similarQueries.length > 0) {
      const similarQuery = similarQueries[0]

      // Adapt the previous response to the current query
      return `I recall a similar question about ${extractSubject(similarQuery.query, ["what", "how", "why", "when", "where", "who"])}. ${similarQuery.response}`
    }

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

  // Function for philosophical or advanced thoughts
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

  // Handle feedback for a message
  const handleFeedback = (messageId: string, feedbackType: "positive" | "negative") => {
    // Update the message with feedback
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: feedbackType } : msg)))

    // Record feedback in learning store if learning is enabled
    if (learningEnabled) {
      recordFeedback(messageId, feedbackType)

      // Update learning stats
      setLearningStats(getLearningStats())
    }
  }

  // Chat content component
  const ChatContent = () => (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("mb-4", message.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start")}
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
                <span className="text-xs">Helpful</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-6 px-2", message.feedback === "negative" && "bg-red-100 text-red-700")}
                onClick={() => handleFeedback(message.id, "negative")}
                disabled={message.feedback !== undefined}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                <span className="text-xs">Not Helpful</span>
              </Button>
            </div>
          )}
        </div>
      ))}
      {messages.length > 0 && (
        <ResponseSaver
          question={messages[messages.length - 2]?.content || ""}
          answer={messages[messages.length - 1]?.content || ""}
          model="Self-Learning Chat"
          category="자가 학습"
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
  )

  // Learning stats content component
  const LearningStatsContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningStats.totalInteractions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Knowledge Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningStats.knowledgeItems}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Positive</span>
              <span>{learningStats.positiveFeedback}</span>
            </div>
            <Progress
              value={
                learningStats.totalInteractions > 0
                  ? (learningStats.positiveFeedback / learningStats.totalInteractions) * 100
                  : 0
              }
              className="h-2"
            />

            <div className="flex justify-between text-sm mt-4">
              <span>Negative</span>
              <span>{learningStats.negativeFeedback}</span>
            </div>
            <Progress
              value={
                learningStats.totalInteractions > 0
                  ? (learningStats.negativeFeedback / learningStats.totalInteractions) * 100
                  : 0
              }
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {learningStats.topTags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag.tag} ({tag.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Are you sure you want to reset all learning data? This cannot be undone.")) {
              resetLearningStore()
              setLearningStats(getLearningStats())
            }
          }}
        >
          Reset Learning Data
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Self-Learning AI Chat</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={learningEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setLearningEnabled(!learningEnabled)}
            >
              <Brain className="h-4 w-4 mr-2" />
              {learningEnabled ? "Learning On" : "Learning Off"}
            </Button>
          </div>
        </div>
        <CardDescription>This AI learns from interactions and improves over time</CardDescription>
      </CardHeader>

      {/* Move Tabs outside of CardContent to fix the hierarchy issue */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="learning">Learning Stats</TabsTrigger>
          </TabsList>

          {usingMockSearch && activeTab === "chat" && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>Using demo search results. This preview uses simulated search data.</AlertDescription>
            </Alert>
          )}

          {error && activeTab === "chat" && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <CardContent className="pt-0">
          <TabsContent value="chat" className="mt-0 space-y-4">
            <ChatContent />
          </TabsContent>

          <TabsContent value="learning" className="mt-0 space-y-4">
            <LearningStatsContent />
          </TabsContent>
        </CardContent>
      </Tabs>

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
