/**
 * Unified Learning System
 *
 * This module provides a centralized learning system that continuously
 * improves from all AI interactions across the application.
 */

// Learning system state
interface LearningState {
  isLearning: boolean
  progress: number
  lastLearned: Date | null
  learningCount: number
  patterns: Pattern[]
  knowledgeBase: KnowledgeItem[]
}

// Pattern recognized from interactions
interface Pattern {
  id: string
  type: "query" | "response" | "interaction"
  pattern: string
  confidence: number
  occurrences: number
  lastSeen: Date
}

// Knowledge item stored in the system
interface KnowledgeItem {
  id: string
  topic: string
  content: string
  source: "user" | "search" | "derived"
  confidence: number
  lastUsed: Date | null
  createdAt: Date
}

// Learning event for subscribers
interface LearningEvent {
  type: "start" | "progress" | "complete" | "error"
  progress?: number
  message?: string
  error?: Error
}

// Learning event subscriber
type LearningEventSubscriber = (event: LearningEvent) => void

/**
 * Unified Learning System - Singleton
 *
 * This class implements a singleton pattern to ensure there's only
 * one learning system across the application.
 */
class UnifiedLearningSystem {
  private static instance: UnifiedLearningSystem
  private state: LearningState
  private subscribers: LearningEventSubscriber[] = []
  private learningInterval: NodeJS.Timeout | null = null

  private constructor() {
    // Initialize learning state
    this.state = {
      isLearning: false,
      progress: 0,
      lastLearned: null,
      learningCount: 0,
      patterns: [],
      knowledgeBase: [],
    }

    // Start background learning if in browser environment
    if (typeof window !== "undefined") {
      this.setupBackgroundLearning()
    }
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): UnifiedLearningSystem {
    if (!UnifiedLearningSystem.instance) {
      UnifiedLearningSystem.instance = new UnifiedLearningSystem()
    }
    return UnifiedLearningSystem.instance
  }

  /**
   * Set up background learning process
   */
  private setupBackgroundLearning(): void {
    // Clear any existing interval
    if (this.learningInterval) {
      clearInterval(this.learningInterval)
    }

    // Set up new interval (every 5 minutes)
    this.learningInterval = setInterval(
      () => {
        if (!this.state.isLearning) {
          this.learn()
        }
      },
      5 * 60 * 1000,
    ) // 5 minutes
  }

  /**
   * Start the learning process
   */
  public learn(): void {
    if (this.state.isLearning) {
      console.warn("Learning already in progress")
      return
    }

    this.state.isLearning = true
    this.state.progress = 0

    // Notify subscribers that learning has started
    this.notifySubscribers({
      type: "start",
      message: "Learning process started",
    })

    // Simulate learning process with progress updates
    this.simulateLearningProcess()
  }

  /**
   * Simulate the learning process
   * In a real implementation, this would perform actual learning
   */
  private simulateLearningProcess(): void {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      this.state.progress = progress

      // Notify subscribers of progress
      this.notifySubscribers({
        type: "progress",
        progress,
        message: `Learning in progress: ${progress}%`,
      })

      if (progress >= 100) {
        clearInterval(interval)
        this.completeLearning()
      }
    }, 300)
  }

  /**
   * Complete the learning process
   */
  private completeLearning(): void {
    // Update state
    this.state.isLearning = false
    this.state.lastLearned = new Date()
    this.state.learningCount++

    // Simulate adding new patterns and knowledge
    this.simulateNewInsights()

    // Notify subscribers that learning is complete
    this.notifySubscribers({
      type: "complete",
      message: "Learning process completed",
    })
  }

  /**
   * Simulate generating new insights from learning
   * In a real implementation, this would analyze data and extract patterns
   */
  private simulateNewInsights(): void {
    // Simulate adding a new pattern
    const patternId = `pattern_${Date.now()}`
    const newPattern: Pattern = {
      id: patternId,
      type: Math.random() > 0.5 ? "query" : "response",
      pattern: `Pattern ${this.state.patterns.length + 1}`,
      confidence: 0.7 + Math.random() * 0.3,
      occurrences: Math.floor(Math.random() * 10) + 1,
      lastSeen: new Date(),
    }

    this.state.patterns.push(newPattern)

    // Simulate adding new knowledge
    const knowledgeId = `knowledge_${Date.now()}`
    const newKnowledge: KnowledgeItem = {
      id: knowledgeId,
      topic: `Topic ${this.state.knowledgeBase.length + 1}`,
      content: `Knowledge content ${this.state.knowledgeBase.length + 1}`,
      source: Math.random() > 0.7 ? "search" : Math.random() > 0.5 ? "user" : "derived",
      confidence: 0.6 + Math.random() * 0.4,
      lastUsed: null,
      createdAt: new Date(),
    }

    this.state.knowledgeBase.push(newKnowledge)
  }

  /**
   * Learn from a specific interaction
   */
  public learnFromInteraction(query: string, response: string): void {
    // In a real implementation, this would analyze the interaction
    // and extract patterns, knowledge, etc.
    console.log(`Learning from interaction: "${query}" -> "${response}"`)

    // For now, just trigger the learning process if not already running
    if (!this.state.isLearning) {
      this.learn()
    }
  }

  /**
   * Get the current learning state
   */
  public getState(): Readonly<LearningState> {
    return { ...this.state }
  }

  /**
   * Subscribe to learning events
   */
  public subscribe(subscriber: LearningEventSubscriber): () => void {
    this.subscribers.push(subscriber)

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber)
    }
  }

  /**
   * Notify all subscribers of a learning event
   */
  private notifySubscribers(event: LearningEvent): void {
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber(event)
      } catch (error) {
        console.error("Error in learning event subscriber:", error)
      }
    })
  }

  /**
   * Get recognized patterns
   */
  public getPatterns(): Readonly<Pattern[]> {
    return [...this.state.patterns]
  }

  /**
   * Get knowledge base items
   */
  public getKnowledgeBase(): Readonly<KnowledgeItem[]> {
    return [...this.state.knowledgeBase]
  }

  /**
   * Add knowledge to the knowledge base
   */
  public addKnowledge(topic: string, content: string, source: "user" | "search" | "derived"): string {
    const id = `knowledge_${Date.now()}`
    const newKnowledge: KnowledgeItem = {
      id,
      topic,
      content,
      source,
      confidence: source === "user" ? 0.9 : source === "search" ? 0.8 : 0.7,
      lastUsed: null,
      createdAt: new Date(),
    }

    this.state.knowledgeBase.push(newKnowledge)
    return id
  }

  /**
   * Reset the learning system
   * This is primarily for testing purposes
   */
  public reset(): void {
    this.state = {
      isLearning: false,
      progress: 0,
      lastLearned: null,
      learningCount: 0,
      patterns: [],
      knowledgeBase: [],
    }

    this.notifySubscribers({
      type: "complete",
      message: "Learning system reset",
    })
  }
}

// Export the singleton instance
export const unifiedLearningSystem = typeof window !== "undefined" ? UnifiedLearningSystem.getInstance() : null

// Export types
export type { LearningState, Pattern, KnowledgeItem, LearningEvent, LearningEventSubscriber }
