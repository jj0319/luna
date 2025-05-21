/**
 * Active Learning System
 *
 * Asks clarifying questions to improve understanding
 */

interface Question {
  id: string
  text: string
  context: string
  timestamp: number
  answered: boolean
  answer?: string
}

export class ActiveLearningSystem {
  private questions: Question[] = []
  private uncertaintyThreshold = 0.5
  private initialized = false

  constructor() {
    // Initialize with empty questions
  }

  /**
   * Initialize the active learning system
   */
  async initialize(): Promise<void> {
    try {
      // Load from localStorage if available
      if (typeof window !== "undefined") {
        const savedQuestions = localStorage.getItem("activeLearningSystem_questions")
        const savedThreshold = localStorage.getItem("activeLearningSystem_threshold")

        if (savedQuestions) {
          this.questions = JSON.parse(savedQuestions)
        }

        if (savedThreshold) {
          this.uncertaintyThreshold = JSON.parse(savedThreshold)
        }
      }

      this.initialized = true
    } catch (error) {
      console.error("Error initializing ActiveLearningSystem:", error)
      throw error
    }
  }

  /**
   * Check if the active learning system is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Generate a clarifying question based on input
   */
  generateQuestion(text: string, context: Record<string, any> = {}): string | null {
    if (!this.initialized) {
      throw new Error("ActiveLearningSystem not initialized")
    }

    // Calculate uncertainty for this input
    const uncertainty = this.calculateUncertainty(text)

    // If uncertainty is above threshold, generate a question
    if (uncertainty > this.uncertaintyThreshold) {
      const question = this.createQuestion(text, context)
      return question.text
    }

    return null
  }

  /**
   * Calculate uncertainty for input text
   */
  private calculateUncertainty(text: string): number {
    // Simple uncertainty calculation
    // In a real system, this would be more sophisticated

    // Ambiguity factors
    let uncertainty = 0

    // Short messages have higher uncertainty
    if (text.length < 10) {
      uncertainty += 0.3
    }

    // Messages with multiple questions have higher uncertainty
    const questionMarks = (text.match(/\?/g) || []).length
    if (questionMarks > 1) {
      uncertainty += 0.2
    }

    // Messages with ambiguous pronouns
    const pronouns = ["it", "this", "that", "they", "them"]
    for (const pronoun of pronouns) {
      if (new RegExp(`\\b${pronoun}\\b`, "i").test(text)) {
        uncertainty += 0.1
        break
      }
    }

    // Messages with vague quantifiers
    const vague = ["some", "many", "few", "several", "most", "various"]
    for (const word of vague) {
      if (new RegExp(`\\b${word}\\b`, "i").test(text)) {
        uncertainty += 0.1
        break
      }
    }

    // Cap uncertainty at 1.0
    return Math.min(uncertainty, 1.0)
  }

  /**
   * Create a clarifying question object
   */
  private createQuestion(text: string, context: Record<string, any>): Question {
    const question: Question = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      text: `Can you clarify "${text}"?`,
      context: JSON.stringify(context),
      timestamp: Date.now(),
      answered: false,
    }

    this.questions.push(question)
    this.saveQuestions()
    return question
  }

  /**
   * Answer a question
   */
  answerQuestion(id: string, answer: string): void {
    const question = this.questions.find((q) => q.id === id)
    if (question) {
      question.answered = true
      question.answer = answer
      this.saveQuestions()
    }
  }

  /**
   * Get unanswered questions
   */
  getUnansweredQuestions(): Question[] {
    return this.questions.filter((q) => !q.answered)
  }

  /**
   * Get all questions
   */
  getAllQuestions(): Question[] {
    return this.questions
  }

  /**
   * Set the uncertainty threshold
   */
  setUncertaintyThreshold(threshold: number): void {
    this.uncertaintyThreshold = threshold
    this.saveThreshold()
  }

  /**
   * Get the uncertainty threshold
   */
  getUncertaintyThreshold(): number {
    return this.uncertaintyThreshold
  }

  /**
   * Save questions to localStorage
   */
  private saveQuestions(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeLearningSystem_questions", JSON.stringify(this.questions))
    }
  }

  /**
   * Save threshold to localStorage
   */
  private saveThreshold(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeLearningSystem_threshold", JSON.stringify(this.uncertaintyThreshold))
    }
  }
}
