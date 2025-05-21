"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

export default function SimpleChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! How can I help you today?",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simple responses based on keywords
    setTimeout(() => {
      let responseContent = "I'm not sure how to respond to that. Can you try asking something else?"

      const lowerInput = input.toLowerCase()

      if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        responseContent = "Hello there! How can I assist you today?"
      } else if (lowerInput.includes("how are you")) {
        responseContent = "I'm just a simple program, but thanks for asking! How can I help you?"
      } else if (lowerInput.includes("help")) {
        responseContent = "I'm a simple chatbot. You can ask me basic questions and I'll try to respond appropriately."
      } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
        responseContent = "Goodbye! Feel free to chat again anytime."
      } else if (lowerInput.includes("thank")) {
        responseContent = "You're welcome! Is there anything else I can help with?"
      } else if (lowerInput.includes("weather")) {
        responseContent = "I'm sorry, I don't have access to real-time weather information."
      } else if (lowerInput.includes("name")) {
        responseContent = "I'm SimpleChatbot, a basic chat interface designed to be error-free."
      } else if (lowerInput.includes("error")) {
        responseContent =
          "I've been designed to be error-free! If you're experiencing issues, please let me know what's happening."
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseContent,
        role: "assistant",
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Simple Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 border rounded-md">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isProcessing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
