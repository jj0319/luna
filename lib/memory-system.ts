/**
 * Memory System
 *
 * Manages short-term and long-term memory for contextual understanding
 */

interface Memory {
  id: string
  text: string
  timestamp: number
  context: Record<string, any>
  importance: number
}

export class MemorySystem {
  private shortTermMemory: Memory[] = []
  private longTermMemory: Memory[] = []
  private episodicMemory: Record<string, Memory[]> = {}
  private initialized = false

  // Configuration
  private shortTermCapacity = 10
  private longTermCapacity = 100

  constructor() {
    // Initialize empty memory
  }

  /**
   * Initialize the memory system
   */
  async initialize(): Promise<void> {
    try {
      // Load from localStorage if available
      if (typeof window !== "undefined") {
        const savedShortTerm = localStorage.getItem("memorySystem_shortTerm")
        const savedLongTerm = localStorage.getItem("memorySystem_longTerm")
        const savedEpisodic = localStorage.getItem("memorySystem_episodic")

        if (savedShortTerm) {
          this.shortTermMemory = JSON.parse(savedShortTerm)
        }

        if (savedLongTerm) {
          this.longTermMemory = JSON.parse(savedLongTerm)
        }

        if (savedEpisodic) {
          this.episodicMemory = JSON.parse(savedEpisodic)
        }
      }

      this.initialized = true
    } catch (error) {
      console.error("Error initializing MemorySystem:", error)
      throw error
    }
  }

  /**
   * Check if the memory system is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Add a new memory
   */
  addMemory(text: string, context: Record<string, any> = {}): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const importance = this.calculateImportance(text, context)

    const memory: Memory = {
      id,
      text,
      timestamp: Date.now(),
      context,
      importance,
    }

    // Add to short-term memory
    this.shortTermMemory.unshift(memory)

    // Trim short-term memory if needed
    if (this.shortTermMemory.length > this.shortTermCapacity) {
      const removed = this.shortTermMemory.pop()
      if (removed && removed.importance > 0.5) {
        // Move important memories to long-term
        this.longTermMemory.unshift(removed)
      }
    }

    // Trim long-term memory if needed
    if (this.longTermMemory.length > this.longTermCapacity) {
      this.longTermMemory.pop()
    }

    // Add to episodic memory if context has a session
    if (context.sessionId) {
      if (!this.episodicMemory[context.sessionId]) {
        this.episodicMemory[context.sessionId] = []
      }
      this.episodicMemory[context.sessionId].push(memory)
    }

    this.saveToStorage()
    return id
  }

  /**
   * Calculate importance of a memory
   */
  private calculateImportance(text: string, context: Record<string, any>): number {
    // Simple importance calculation
    let importance = 0

    // Length factor (longer texts might be more important)
    const lengthFactor = Math.min(text.length / 100, 1) * 0.2
    importance += lengthFactor

    // Question factor (questions might be more important)
    const questionFactor = text.includes("?") ? 0.3 : 0
    importance += questionFactor

    // Emotional content factor
    const emotionalWords = ["love", "hate", "happy", "sad", "angry", "excited", "important", "critical", "urgent"]
    const emotionFactor = emotionalWords.some((word) => text.toLowerCase().includes(word)) ? 0.3 : 0
    importance += emotionFactor

    // Context factor
    const contextFactor = Object.keys(context).length * 0.05
    importance += Math.min(contextFactor, 0.2)

    return Math.min(importance, 1)
  }

  /**
   * Retrieve relevant memories based on a query
   */
  retrieveMemories(query: string, limit = 5): Memory[] {
    // Combine short and long-term memories
    const allMemories = [...this.shortTermMemory, ...this.longTermMemory]

    // Simple relevance scoring based on text similarity
    const scoredMemories = allMemories.map((memory) => {
      const relevance = this.calculateRelevance(query, memory.text)
      return { memory, relevance }
    })

    // Sort by relevance and return top results
    return scoredMemories
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
      .map((item) => item.memory)
  }

  /**
   * Calculate relevance between query and memory text
   */
  private calculateRelevance(query: string, memoryText: string): number {
    // Simple word overlap for relevance
    const queryWords = new Set(query.toLowerCase().split(/\s+/))
    const memoryWords = memoryText.toLowerCase().split(/\s+/)

    let matchCount = 0
    for (const word of memoryWords) {
      if (queryWords.has(word)) {
        matchCount++
      }
    }

    return matchCount / Math.max(queryWords.size, 1)
  }

  /**
   * Get the size of short-term memory
   */
  getShortTermSize(): number {
    return this.shortTermMemory.length
  }

  /**
   * Get the size of long-term memory
   */
  getLongTermSize(): number {
    return this.longTermMemory.length
  }

  /**
   * Get the count of episodic memories
   */
  getEpisodicCount(): number {
    return Object.keys(this.episodicMemory).length
  }

  /**
   * Save memory to localStorage
   */
  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("memorySystem_shortTerm", JSON.stringify(this.shortTermMemory))
      localStorage.setItem("memorySystem_longTerm", JSON.stringify(this.longTermMemory))
      localStorage.setItem("memorySystem_episodic", JSON.stringify(this.episodicMemory))
    }
  }

  /**
   * Convert memory system to JSON
   */
  toJSON(): string {
    return JSON.stringify({
      shortTermMemory: this.shortTermMemory,
      longTermMemory: this.longTermMemory,
      episodicMemory: this.episodicMemory,
    })
  }

  /**
   * Load memory system from JSON
   */
  fromJSON(json: string): void {
    const data = JSON.parse(json)
    this.shortTermMemory = data.shortTermMemory || []
    this.longTermMemory = data.longTermMemory || []
    this.episodicMemory = data.episodicMemory || {}
    this.initialized = true
  }
}
