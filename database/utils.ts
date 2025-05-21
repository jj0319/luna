/**
 * Database Utilities
 *
 * Helper functions for working with the database.
 */

import type { ResponseData, SearchResult } from "./schema"
import { addResponse, getResponses, getStats } from "./store"

/**
 * Extract keywords from a query
 */
export const extractKeywords = (query: string): string[] => {
  // Simple keyword extraction - remove common words and split
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
  ]

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 2 && !stopWords.includes(word)) // Remove stop words and short words
}

/**
 * Find similar responses to a query
 */
export const findSimilarResponses = (query: string, limit = 3): ResponseData[] => {
  const keywords = extractKeywords(query)
  if (keywords.length === 0) return []

  // Get all responses
  const allResponses = getResponses()

  // Score each response based on keyword matches
  const scoredResponses = allResponses.map((response) => {
    const responseKeywords = extractKeywords(response.query)
    const matchCount = keywords.filter((keyword) => responseKeywords.includes(keyword)).length

    const score = matchCount / Math.max(keywords.length, responseKeywords.length)

    return {
      response,
      score,
    }
  })

  // Sort by score and return top matches
  return scoredResponses
    .filter((item) => item.score > 0.2) // Only include somewhat relevant matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.response)
}

/**
 * Calculate sentiment score for a text
 * Returns a score between -1 (negative) and 1 (positive)
 */
export const calculateSentiment = (text: string): number => {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "helpful",
    "useful",
    "beneficial",
    "positive",
    "success",
    "successful",
    "happy",
    "glad",
    "pleased",
    "satisfied",
    "impressive",
    "love",
    "like",
  ]

  const negativeWords = [
    "bad",
    "poor",
    "terrible",
    "awful",
    "horrible",
    "disappointing",
    "useless",
    "unhelpful",
    "negative",
    "failure",
    "failed",
    "sad",
    "upset",
    "dissatisfied",
    "unimpressive",
    "hate",
    "dislike",
  ]

  const words = text.toLowerCase().split(/\s+/)

  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  const totalWords = words.length
  if (totalWords === 0) return 0

  return (positiveCount - negativeCount) / Math.sqrt(totalWords)
}

/**
 * Save a chat interaction to the database
 */
export const saveInteraction = (
  query: string,
  response: string,
  model?: string,
  searchResults?: SearchResult[],
): string => {
  // Calculate sentiment
  const sentimentScore = calculateSentiment(response)
  let sentimentLabel: "positive" | "neutral" | "negative" = "neutral"

  if (sentimentScore > 0.2) sentimentLabel = "positive"
  else if (sentimentScore < -0.2) sentimentLabel = "negative"

  // Determine categories
  const categories = determineCategories(query, response)

  // Create response data
  const responseData: Omit<ResponseData, "id"> = {
    query,
    response,
    timestamp: Date.now(),
    metadata: {
      model,
      confidence: 0.8, // Default confidence
      processingTime: 500, // Default processing time in ms
      searchUsed: !!searchResults,
      searchResults,
      categories,
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel,
      },
    },
  }

  // Add to database and return ID
  return addResponse(responseData)
}

/**
 * Determine categories for a query and response
 */
const determineCategories = (query: string, response: string): string[] => {
  const categories: string[] = []
  const lowerQuery = query.toLowerCase()

  // Simple rule-based categorization
  if (lowerQuery.includes("what") || lowerQuery.includes("define") || lowerQuery.includes("explain")) {
    categories.push("definition")
  }

  if (lowerQuery.includes("how") || lowerQuery.includes("steps") || lowerQuery.includes("process")) {
    categories.push("how-to")
  }

  if (lowerQuery.includes("why") || lowerQuery.includes("reason")) {
    categories.push("reasoning")
  }

  if (lowerQuery.includes("when") || lowerQuery.includes("time") || lowerQuery.includes("date")) {
    categories.push("temporal")
  }

  if (lowerQuery.includes("where") || lowerQuery.includes("location") || lowerQuery.includes("place")) {
    categories.push("location")
  }

  if (lowerQuery.includes("who") || lowerQuery.includes("person") || lowerQuery.includes("people")) {
    categories.push("person")
  }

  // Add a general category if no specific categories were added
  if (categories.length === 0) {
    categories.push("general")
  }

  return categories
}

/**
 * Export database to JSON
 */
export const exportDatabase = (): string => {
  const data = {
    responses: getResponses(),
    stats: getStats(),
  }

  return JSON.stringify(data, null, 2)
}

/**
 * Generate a report of database contents
 */
export const generateReport = (): string => {
  const stats = getStats()
  const responses = getResponses({ limit: 100 })

  let report = `# Database Report\n\n`
  report += `Generated: ${new Date().toLocaleString()}\n\n`

  report += `## Statistics\n\n`
  report += `- Total Responses: ${stats.totalResponses}\n`
  report += `- Total Feedback: ${stats.totalFeedback}\n`
  report += `- Average Rating: ${(stats.averageRating * 100).toFixed(1)}%\n\n`

  report += `## Top Queries\n\n`
  stats.topQueries.forEach((item, index) => {
    report += `${index + 1}. "${item.query}" (${item.count} times)\n`
  })

  report += `\n## Recent Responses\n\n`
  responses.slice(0, 10).forEach((response, index) => {
    report += `### ${index + 1}. Query: ${response.query}\n`
    report += `Response: ${response.response.substring(0, 100)}${response.response.length > 100 ? "..." : ""}\n`
    report += `Time: ${new Date(response.timestamp).toLocaleString()}\n\n`
  })

  return report
}
