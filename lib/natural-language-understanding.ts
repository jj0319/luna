/**
 * Natural Language Understanding
 *
 * Simple NLU capabilities for analyzing text
 */

interface NLUResult {
  intent: "question" | "command" | "statement"
  topics: string[]
  sentiment: "positive" | "neutral" | "negative"
  entities: {
    type: string
    value: string
  }[]
  confidence: number
}

class NaturalLanguageUnderstanding {
  /**
   * Analyze text to extract intent, topics, sentiment, and entities
   */
  analyze(text: string): NLUResult {
    // Determine intent
    const intent = this.determineIntent(text)

    // Extract topics
    const topics = this.extractTopics(text)

    // Analyze sentiment
    const sentiment = this.analyzeSentiment(text)

    // Extract entities
    const entities = this.extractEntities(text)

    // Calculate confidence
    const confidence = this.calculateConfidence(text)

    return {
      intent,
      topics,
      sentiment,
      entities,
      confidence,
    }
  }

  /**
   * Determine the intent of the text
   */
  private determineIntent(text: string): "question" | "command" | "statement" {
    const lowerText = text.toLowerCase()

    // Check if it's a question
    if (
      lowerText.includes("?") ||
      lowerText.startsWith("what") ||
      lowerText.startsWith("who") ||
      lowerText.startsWith("where") ||
      lowerText.startsWith("when") ||
      lowerText.startsWith("why") ||
      lowerText.startsWith("how") ||
      lowerText.startsWith("which") ||
      lowerText.startsWith("can") ||
      lowerText.startsWith("does") ||
      lowerText.startsWith("is") ||
      lowerText.startsWith("are")
    ) {
      return "question"
    }

    // Check if it's a command
    if (
      lowerText.startsWith("find") ||
      lowerText.startsWith("search") ||
      lowerText.startsWith("get") ||
      lowerText.startsWith("show") ||
      lowerText.startsWith("tell") ||
      lowerText.startsWith("give") ||
      lowerText.startsWith("list") ||
      lowerText.startsWith("create") ||
      lowerText.startsWith("make") ||
      lowerText.startsWith("build")
    ) {
      return "command"
    }

    // Default to statement
    return "statement"
  }

  /**
   * Extract topics from text
   */
  private extractTopics(text: string): string[] {
    // Simple topic extraction based on noun phrases
    // In a real implementation, this would use NLP techniques

    const words = text.toLowerCase().split(/\s+/)
    const stopWords = [
      "a",
      "an",
      "the",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "to",
      "of",
      "and",
      "or",
      "in",
      "on",
      "at",
      "by",
      "for",
      "with",
      "about",
      "against",
      "between",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "from",
      "up",
      "down",
      "what",
      "when",
      "where",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "can",
      "will",
      "just",
      "should",
      "now",
    ]

    // Filter out stop words and short words
    const contentWords = words.filter((word) => !stopWords.includes(word) && word.length > 3)

    // Count word frequency
    const wordCounts: Record<string, number> = {}
    contentWords.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })

    // Get top words as topics
    const topics = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word)

    // If no topics found, return a default
    if (topics.length === 0) {
      return ["general"]
    }

    return topics
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
    const lowerText = text.toLowerCase()

    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "terrific",
      "outstanding",
      "superb",
      "brilliant",
      "awesome",
      "happy",
      "glad",
      "pleased",
      "delighted",
      "satisfied",
      "love",
      "like",
    ]

    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "poor",
      "disappointing",
      "miserable",
      "unfortunate",
      "unpleasant",
      "sad",
      "unhappy",
      "angry",
      "upset",
      "annoyed",
      "frustrated",
      "hate",
      "dislike",
    ]

    let positiveCount = 0
    let negativeCount = 0

    // Count positive and negative words
    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) positiveCount++
    })

    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) negativeCount++
    })

    // Determine sentiment based on counts
    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  /**
   * Extract entities from text
   */
  private extractEntities(text: string): { type: string; value: string }[] {
    const entities: { type: string; value: string }[] = []

    // Simple entity extraction
    // In a real implementation, this would use NER techniques

    // Extract dates
    const dateRegex =
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?(,\s+\d{4})?\b/gi
    const dates = text.match(dateRegex)
    if (dates) {
      dates.forEach((date) => {
        entities.push({ type: "date", value: date })
      })
    }

    // Extract numbers
    const numberRegex = /\b\d+(\.\d+)?\b/g
    const numbers = text.match(numberRegex)
    if (numbers) {
      numbers.forEach((number) => {
        entities.push({ type: "number", value: number })
      })
    }

    // Extract emails
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = text.match(emailRegex)
    if (emails) {
      emails.forEach((email) => {
        entities.push({ type: "email", value: email })
      })
    }

    return entities
  }

  /**
   * Calculate confidence score for the analysis
   */
  private calculateConfidence(text: string): number {
    // Simple confidence calculation
    // In a real implementation, this would be more sophisticated

    // Longer text generally provides more context
    const lengthFactor = Math.min(text.length / 100, 0.5)

    // Base confidence
    const baseConfidence = 0.7

    return Math.min(baseConfidence + lengthFactor, 1.0)
  }
}

// Export singleton instance
export const nlu = new NaturalLanguageUnderstanding()
