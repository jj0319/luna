/**
 * Conversation Context Manager
 *
 * 대화 컨텍스트를 관리하고 관련 정보를 추적하는 기능을 제공합니다.
 */

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  metadata?: Record<string, any>
}

export interface Topic {
  id: string
  name: string
  confidence: number
  firstMentionedAt: number
  lastMentionedAt: number
  mentionCount: number
}

export interface Entity {
  id: string
  name: string
  type: string
  value: string
  firstMentionedAt: number
  lastMentionedAt: number
  mentionCount: number
}

export interface ConversationSummary {
  topics: Topic[]
  entities: Entity[]
  messageCount: number
  startTime: number
  lastUpdateTime: number
}

export class ContextManager {
  private messages: Message[] = []
  private topics: Map<string, Topic> = new Map()
  private entities: Map<string, Entity> = new Map()
  private conversationId: string
  private maxContextSize = 20

  constructor(conversationId?: string) {
    this.conversationId = conversationId || this.generateId()
    this.loadFromStorage()
  }

  /**
   * 메시지 추가
   */
  public addMessage(role: "user" | "assistant" | "system", content: string, metadata?: Record<string, any>): Message {
    const message: Message = {
      id: this.generateId(),
      role,
      content,
      timestamp: Date.now(),
      metadata,
    }

    this.messages.push(message)

    // 컨텍스트 크기 제한
    if (this.messages.length > this.maxContextSize) {
      // 시스템 메시지는 유지
      const systemMessages = this.messages.filter((m) => m.role === "system")
      const nonSystemMessages = this.messages
        .filter((m) => m.role !== "system")
        .slice(-this.maxContextSize + systemMessages.length)

      this.messages = [...systemMessages, ...nonSystemMessages]
    }

    // 토픽과 엔티티 추출 (사용자 메시지만)
    if (role === "user") {
      this.extractTopicsAndEntities(content)
    }

    this.saveToStorage()

    return message
  }

  /**
   * 메시지 가져오기
   */
  public getMessages(): Message[] {
    return [...this.messages]
  }

  /**
   * 최근 메시지 가져오기
   */
  public getRecentMessages(count = 10): Message[] {
    return this.messages.slice(-count)
  }

  /**
   * 대화 요약 가져오기
   */
  public getConversationSummary(): ConversationSummary {
    return {
      topics: Array.from(this.topics.values()).sort((a, b) => b.mentionCount - a.mentionCount),
      entities: Array.from(this.entities.values()).sort((a, b) => b.lastMentionedAt - a.lastMentionedAt),
      messageCount: this.messages.length,
      startTime: this.messages.length > 0 ? this.messages[0].timestamp : Date.now(),
      lastUpdateTime: this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp : Date.now(),
    }
  }

  /**
   * 대화 컨텍스트 초기화
   */
  public clearContext(): void {
    // 시스템 메시지만 유지
    this.messages = this.messages.filter((m) => m.role === "system")
    this.topics.clear()
    this.entities.clear()
    this.saveToStorage()
  }

  /**
   * 최대 컨텍스트 크기 설정
   */
  public setMaxContextSize(size: number): void {
    this.maxContextSize = size

    // 크기 조정
    if (this.messages.length > this.maxContextSize) {
      const systemMessages = this.messages.filter((m) => m.role === "system")
      const nonSystemMessages = this.messages
        .filter((m) => m.role !== "system")
        .slice(-this.maxContextSize + systemMessages.length)

      this.messages = [...systemMessages, ...nonSystemMessages]
      this.saveToStorage()
    }
  }

  /**
   * 토픽과 엔티티 추출
   */
  private extractTopicsAndEntities(content: string): void {
    // 간단한 토픽 추출 (키워드 기반)
    const words = content.toLowerCase().split(/\s+/)
    const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"]

    const keywords = words
      .filter((word) => word.length > 3 && !stopWords.includes(word))
      .map((word) => word.replace(/[^\w가-힣]/g, ""))
      .filter((word) => word.length > 0)

    // 빈도수 계산
    const keywordCounts = new Map<string, number>()

    keywords.forEach((keyword) => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1)
    })

    // 상위 키워드를 토픽으로 추출
    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    const now = Date.now()

    // 토픽 업데이트
    topKeywords.forEach(([keyword, count]) => {
      if (this.topics.has(keyword)) {
        const topic = this.topics.get(keyword)!
        topic.mentionCount += count
        topic.lastMentionedAt = now
        topic.confidence = Math.min(topic.confidence + 0.1, 1.0)
      } else {
        this.topics.set(keyword, {
          id: this.generateId(),
          name: keyword,
          confidence: 0.6,
          firstMentionedAt: now,
          lastMentionedAt: now,
          mentionCount: count,
        })
      }
    })

    // 간단한 엔티티 추출 (패턴 매칭)
    this.extractEntities(content, now)
  }

  /**
   * 엔티티 추출
   */
  private extractEntities(content: string, timestamp: number): void {
    // 이메일 추출
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = content.match(emailRegex) || []

    emails.forEach((email) => {
      this.updateEntity(email, "email", email, timestamp)
    })

    // URL 추출
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = content.match(urlRegex) || []

    urls.forEach((url) => {
      this.updateEntity(url, "url", url, timestamp)
    })

    // 날짜 추출
    const dateRegex = /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/g
    const dates = content.match(dateRegex) || []

    dates.forEach((date) => {
      this.updateEntity(date, "date", date, timestamp)
    })

    // 숫자 추출
    const numberRegex = /\b\d+(?:\.\d+)?\b/g
    const numbers = content.match(numberRegex) || []

    numbers.forEach((number) => {
      this.updateEntity(number, "number", number, timestamp)
    })
  }

  /**
   * 엔티티 업데이트
   */
  private updateEntity(name: string, type: string, value: string, timestamp: number): void {
    const key = `${type}:${name}`

    if (this.entities.has(key)) {
      const entity = this.entities.get(key)!
      entity.mentionCount += 1
      entity.lastMentionedAt = timestamp
    } else {
      this.entities.set(key, {
        id: this.generateId(),
        name,
        type,
        value,
        firstMentionedAt: timestamp,
        lastMentionedAt: timestamp,
        mentionCount: 1,
      })
    }
  }

  /**
   * 고유 ID 생성
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  /**
   * 스토리지에서 로드
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return

    try {
      const key = `context_${this.conversationId}`
      const savedData = localStorage.getItem(key)

      if (savedData) {
        const data = JSON.parse(savedData)

        this.messages = data.messages || []
        this.topics = new Map(data.topics || [])
        this.entities = new Map(data.entities || [])
      }
    } catch (error) {
      console.error("Failed to load context from storage:", error)
    }
  }

  /**
   * 스토리지에 저장
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return

    try {
      const key = `context_${this.conversationId}`
      const data = {
        messages: this.messages,
        topics: Array.from(this.topics.entries()),
        entities: Array.from(this.entities.entries()),
      }

      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save context to storage:", error)
    }
  }

  /**
   * 대화 ID 가져오기
   */
  public getConversationId(): string {
    return this.conversationId
  }
}

// 싱글톤 인스턴스 생성
export const contextManager = new ContextManager()
