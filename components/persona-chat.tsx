"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { personaSystem, type EmotionalState } from "@/lib/persona-system"

interface Message {
  id: string
  content: string
  sender: "user" | "persona"
  timestamp: number
  emotion?: string
  thinking?: string
  associations?: string[]
  memories?: string[]
}

export function PersonaChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [activePersona, setActivePersona] = useState<any>(null)
  const [showThinking, setShowThinking] = useState(false)
  const [showEmotions, setShowEmotions] = useState(true)
  const [showMemories, setShowMemories] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        await personaSystem.initialize()
        const persona = personaSystem.getActivePersona()

        if (persona) {
          setActivePersona(persona)
          // 환영 메시지 추가
          setMessages([
            {
              id: `welcome-${Date.now()}`,
              content: `안녕하세요! 저는 ${persona.name}입니다. ${persona.description.split('.')[0]}. 무엇을 도와드릴까요?`,
              sender: "persona",
              timestamp: Date.now(),
              emotion: persona.currentEmotionalState.dominant,
              thinking: "사용자와의 첫 대화를 시작합니다. 친근하고 도움이 되는 첫인상을 주는 것이 중요합니다.",
              associations: ["greeting", "introduction", "help"],
              memories: []
            },
          ])
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize persona system:", error)
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  // 메시지 변경 시 스크롤 아래로
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isSending || !activePersona) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsSending(true)

    try {
      // 활성 인격체로 입력 처리
      const { response, emotionalState, persona } = await personaSystem.processInput(input)

      // 자연스러운 느낌을 위한 약간의 지연
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 인격체의 "생각" 생성 (실제 시스템에서는 더 복잡한 로직이 있을 수 있음)
      const thinking = generateThinking(input, emotionalState)
      
      // 관련 기억과 연관성 (실제 시스템에서는 더 복잡한 로직이 있을 수 있음)
      const associations = generateAssociations(input, persona)
      const memories = generateMemories(input, persona)

      const personaMessage: Message = {
        id: `persona-${Date.now()}`,
        content: response,
        sender: "persona",
        timestamp: Date.now(),
        emotion: emotionalState.dominant,
        thinking,
        associations,
        memories
      }

      setMessages((prev) => [...prev, personaMessage])
      setActivePersona({
        ...activePersona,
        currentEmotionalState: emotionalState,
      })
    } catch (error) {
      console.error("Error processing message:", error)

      // 오류 메시지 추가
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "죄송합니다, 메시지를 처리하는 동안 오류가 발생했습니다.",
        sender: "persona",
        timestamp: Date.now(),
        emotion: "sadness",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    if (activePersona) {
      setMessages([
        {
          id: `welcome-reset-${Date.now()}`,
          content: `대화가 초기화되었습니다. 안녕하세요! 저는 ${activePersona.name}입니다. 무엇을 도와드릴까요?`,
          sender: "persona",
          timestamp: Date.now(),
          emotion: activePersona.currentEmotionalState.dominant,
          thinking: "대화가 초기화되었습니다. 새로운 대화를 시작합니다.",
          associations: ["reset", "greeting", "help"],
          memories: []
        },
      ])
    }
  }

  // 인격체의 "생각" 생성 (실제 구현에서는 더 복잡할 수 있음)
  const generateThinking = (input: string, emotionalState: EmotionalState): string => {
    const thoughts = [
      `사용자의 입력 "${input.substring(0, 20)}..."을 분석 중입니다. 현재 감정 상태는 ${emotionalState.dominant}입니다.`,
      `이 질문에 대한 가장 도움이 되는 응답을 생성하려고 합니다. 관련 지식을 검색 중입니다.`,
      `사용자의 의도를 파악하려고 합니다. 정보 요청인지, 감정적 지원인지, 아니면 일반적인 대화인지 분석 중입니다.`,
      `이전 대화 맥락과 현재 입력을 종합하여 일관된 응답을 생성하려고 합니다.`,
      `사용자의 질문에 공감하면서도 정확한 정보를 제공하는 균형을 찾고 있습니다.`,
      `이 주제에 대한 다양한 관점을 고려하여 균형 잡힌 응답을 준비하고 있습니다.`,
      `사용자의 감정 상태를 고려하여 적절한 톤과 내용으로 응답하려고 합니다.`,
      `이 대화의 맥락에서 가장 관련성 높은 정보를 우선순위화하고 있습니다.`,
      `사용자의 질문에 숨겨진 의도나 가정이 있는지 분석하고 있습니다.`,
      `이 응답이 사용자에게 어떤 가치를 제공할 수 있을지 고려하고 있습니다.`
    ]
    
    return thoughts[Math.floor(Math.random() * thoughts.length)]
  }

  // 연관성 생성 (실제 구현에서는 더 복잡할 수 있음)
  const generateAssociations = (input: string, persona: any): string[] => {
    const words = input.toLowerCase().split(/\s+/)
    const associations = []
    
    // 지식 영역과 연관성 확인
    for (const domain of persona.knowledgeDomains) {
      if (words.some(word => domain.name.toLowerCase().includes(word) || 
                     domain.interests.some(interest => interest.toLowerCase().includes(word)))) {
        associations.push(`지식:${domain.name}`)
      }
    }
    
    // 가치와 연관성 확인
    for (const value of persona.values) {
      if (words.some(word => value.name.toLowerCase().includes(word) || 
                     value.description.toLowerCase().includes(word))) {
        associations.push(`가치:${value.name}`)
      }
    }
    
    // 감정과 연관성 확인
    const emotions = ['기쁨', '슬픔', '분노', '두려움', '놀람', '혐오', '신뢰', '기대']
    for (const emotion of emotions) {
      if (words.some(word => emotion.includes(word) || word.includes(emotion))) {
        associations.push(`감정:${emotion}`)
      }
    }
    
    // 랜덤 연관성 추가 (실제 구현에서는 더 정교할 것)
    const randomAssociations = [
      '대화', '질문', '정보', '도움', '학습', '이해', '분석', '설명',
      '지식', '경험', '관점', '의견', '생각', '아이디어', '개념', '이론'
    ]
    
    const randomCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < randomCount; i++) {
      const randomIndex = Math.floor(Math.random() * randomAssociations.length)
      associations.push(randomAssociations[randomIndex])
    }
    
    // 중복 제거 및 최대 5개로 제한
    return [...new Set(associations)].slice(0, 5)
  }

  // 기억 생성 (실제 구현에서는 더 복잡할 수 있음)
  const generateMemories = (input: string, persona: any): string[] => {
    // 실제 구현에서는 이전 대화나 관련 지식에서 기억을 검색할 것
    const memories = [
      "이전에 비슷한 주제에 대해 논의한 적이 있습니다.",
      "이 주제는 제 지식 영역 중 하나와 관련이 있습니다.",
      "사용자가 이전에 이와 관련된 질문을 한 적이 있습니다.",
      "이 개념은 다른 여러 주제와 연결되어 있습니다.",
      "이 질문은 중요한 가치나 원칙과 관련이 있습니다.",
      "이 주제에 대한 다양한 관점이 존재합니다.",
      "이 정보는 최근에 업데이트되었습니다.",
      "이 개념은 여러 분야에 걸쳐 적용될 수 있습니다.",
      "이 질문은 자주 묻는 질문 중 하나입니다.",
      "이 주제는 복잡하지만 중요한 함의를 가지고 있습니다."
    ]
    
    // 랜덤하게 0-3개의 기억 선택
    const count = Math.floor(Math.random() * 4)
    const selectedMemories = []
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * memories.length)
      selectedMemories.push(memories[randomIndex])
      // 중복 방지를 위해 선택된 기억 제거
      memories.splice(randomIndex, 1)
      if (memories.length === 0) break
    }
