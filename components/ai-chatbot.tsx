"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { SkillsManager } from "../lib/skills-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Send, Info } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  metadata?: any
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const skillsManager = useRef<SkillsManager>(new SkillsManager())

  useEffect(() => {
    const initializeSkills = async () => {
      try {
        await skillsManager.current.initialize()
        setMessages([
          {
            id: "1",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ])
      } catch (error) {
        console.error("Failed to initialize skills:", error)
        setMessages([
          {
            id: "1",
            content: "I'm having trouble initializing. Please try again later.",
            role: "assistant",
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    initializeSkills()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const result = await skillsManager.current.processInput(input)

      // Simulate typing effect
      setTimeout(
        () => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: result.response,
            role: "assistant",
            timestamp: new Date(),
            metadata: result.metadata,
          }

          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
        },
        1000 + Math.random() * 1000,
      )
    } catch (error) {
      console.error("Error processing message:", error)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: "I'm sorry, I encountered an error processing your request.",
            role: "assistant",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    // In a real implementation, we would send this feedback to the server
    console.log(`Feedback for message ${messageId}: ${isPositive ? "positive" : "negative"}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>AI Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
              <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
              <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md"></div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>AI Chatbot</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMetadata(!showMetadata)}
              title={showMetadata ? "Hide AI details" : "Show AI details"}
            >
              <Info size={18} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 h-[60vh] overflow-y-auto p-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className={`h-8 w-8 ${message.role === "assistant" ? "bg-blue-500" : "bg-gray-500"}`}>
                    <span className="text-xs text-white">{message.role === "assistant" ? "AI" : "You"}</span>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      {new Date(message.timestamp).toLocaleTimeString()}

                      {message.role === "assistant" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className="text-gray-400 hover:text-green-500"
                            title="Helpful"
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className="text-gray-400 hover:text-red-500"
                            title="Not helpful"
                          >
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {showMetadata && message.metadata && (
                      <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                        <details>
                          <summary className="cursor-pointer">AI Details</summary>
                          <pre className="whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(message.metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-blue-500">
                    <span className="text-xs text-white">AI</span>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gray-100">
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
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
