/**
 * Learning Store
 *
 * This module provides functionality for the AI to learn from interactions
 * and improve its responses over time.
 */

// Types for the learning system
export type Feedback = {
  messageId: string
  rating: "positive" | "negative"
  timestamp: number
}

export type LearningEntry = {
  query: string
  response: string
  feedback?: Feedback
  timestamp: number
  tags: string[]
}

export type KnowledgeItem = {
  id: string
  content: string
  confidence: number
  usageCount: number
  lastUsed: number
  tags: string[]
}

// In-memory storage (would be replaced with a database in production)
let learningEntries: LearningEntry[] = []
let knowledgeBase: KnowledgeItem[] = []

// Local storage keys
const LEARNING_ENTRIES_KEY = "ai_learning_entries"
const KNOWLEDGE_BASE_KEY = "ai_knowledge_base"

// Initialize from localStorage if available (client-side only)
const initializeFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const storedEntries = localStorage.getItem(LEARNING_ENTRIES_KEY)
      if (storedEntries) {
        learningEntries = JSON.parse(storedEntries)
      }

      const storedKnowledge = localStorage.getItem(KNOWLEDGE_BASE_KEY)
      if (storedKnowledge) {
        knowledgeBase = JSON.parse(storedKnowledge)
      }
    } catch (error) {
      console.error("Error loading learning data from storage:", error)
    }
  }
}

// Save to localStorage (client-side only)
const saveToStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEARNING_ENTRIES_KEY, JSON.stringify(learningEntries))
      localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(knowledgeBase))
    } catch (error) {
      console.error("Error saving learning data to storage:", error)
    }
  }
}

/**
 * Add a new interaction to the learning store
 */
export const recordInteraction = (query: string, response: string, tags: string[] = []): string => {
  const entryId = Math.random().toString(36).substring(2, 10)

  const entry: LearningEntry = {
    query,
    response,
    timestamp: Date.now(),
    tags,
  }

  learningEntries.push(entry)
  saveToStorage()

  return entryId
}

/**
 * Record feedback for a specific interaction
 */
export const recordFeedback = (messageId: string, rating: "positive" | "negative"): boolean => {
  const entryIndex = learningEntries.findIndex((entry) => entry.query === messageId || entry.response === messageId)

  if (entryIndex === -1) return false

  learningEntries[entryIndex].feedback = {
    messageId,
    rating,
    timestamp: Date.now(),
  }

  // If positive feedback, consider adding to knowledge base
  if (rating === "positive") {
    learnFromPositiveFeedback(learningEntries[entryIndex])
  }

  saveToStorage()
  return true
}

/**
 * Learn from positive feedback by adding to knowledge base
 */
const learnFromPositiveFeedback = (entry: LearningEntry) => {
  // Extract potential knowledge from the interaction
  const knowledgeContent = extractKnowledge(entry.query, entry.response)

  if (!knowledgeContent) return

  const existingIndex = knowledgeBase.findIndex((k) => k.content === knowledgeContent)

  if (existingIndex >= 0) {
    // Update existing knowledge
    knowledgeBase[existingIndex].confidence += 0.1
    knowledgeBase[existingIndex].usageCount += 1
    knowledgeBase[existingIndex].lastUsed = Date.now()
  } else {
    // Add new knowledge
    knowledgeBase.push({
      id: Math.random().toString(36).substring(2, 10),
      content: knowledgeContent,
      confidence: 0.6, // Start with moderate confidence
      usageCount: 1,
      lastUsed: Date.now(),
      tags: entry.tags,
    })
  }

  saveToStorage()
}

/**
 * Extract potential knowledge from an interaction
 */
const extractKnowledge = (query: string, response: string): string | null => {
  // Simple extraction - in a real system this would be more sophisticated
  const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 20)

  if (sentences.length === 0) return null

  // Select the most informative sentence (simple heuristic: longest sentence)
  return sentences.sort((a, b) => b.length - a.length)[0].trim()
}

/**
 * Find relevant knowledge for a given query
 */
export const findRelevantKnowledge = (query: string): KnowledgeItem[] => {
  // Simple relevance matching - would use embeddings or more sophisticated matching in production
  const queryWords = new Set(
    query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  )

  if (queryWords.size === 0) return []

  return knowledgeBase
    .map((item) => {
      const contentWords = new Set(
        item.content
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 3),
      )

      // Calculate overlap between query words and content words
      const overlap = [...queryWords].filter((word) => contentWords.has(word)).length
      const relevanceScore = overlap / Math.max(queryWords.size, 1)

      return {
        item,
        relevanceScore,
      }
    })
    .filter((result) => result.relevanceScore > 0.2) // Only return somewhat relevant items
    .sort((a, b) => {
      // Sort by relevance and confidence
      const scoreA = a.relevanceScore * a.item.confidence
      const scoreB = b.relevanceScore * b.item.confidence
      return scoreB - scoreA
    })
    .slice(0, 3) // Return top 3 most relevant items
    .map((result) => result.item)
}

/**
 * Get similar past queries
 */
export const getSimilarQueries = (query: string): LearningEntry[] => {
  const queryWords = new Set(
    query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  )

  if (queryWords.size === 0) return []

  return learningEntries
    .map((entry) => {
      const entryWords = new Set(
        entry.query
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 3),
      )

      // Calculate overlap
      const overlap = [...queryWords].filter((word) => entryWords.has(word)).length
      const similarityScore = overlap / Math.max(queryWords.size, 1)

      return {
        entry,
        similarityScore,
      }
    })
    .filter((result) => result.similarityScore > 0.5) // Only return similar queries
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3) // Return top 3 most similar queries
    .map((result) => result.entry)
}

/**
 * Get statistics about the learning system
 */
export const getLearningStats = () => {
  return {
    totalInteractions: learningEntries.length,
    knowledgeItems: knowledgeBase.length,
    positiveFeedback: learningEntries.filter((e) => e.feedback?.rating === "positive").length,
    negativeFeedback: learningEntries.filter((e) => e.feedback?.rating === "negative").length,
    topTags: getTopTags(),
  }
}

/**
 * Get the most common tags
 */
const getTopTags = (): { tag: string; count: number }[] => {
  const tagCounts: Record<string, number> = {}

  // Count occurrences of each tag
  learningEntries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  // Convert to array and sort
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Return top 5 tags
}

// Initialize on module load
initializeFromStorage()

// Export a function to reset the learning store (for testing)
export const resetLearningStore = () => {
  learningEntries = []
  knowledgeBase = []
  saveToStorage()
}
