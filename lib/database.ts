/**
 * Database Module
 *
 * This module provides all database functionality in a single file
 * to avoid import resolution issues.
 */

// Types and Interfaces
export interface SearchResult {
  title: string
  link: string
  snippet: string
  source?: string
  timestamp?: number
}

export interface ResponseData {
  id: string
  query: string
  response: string
  timestamp: number
  metadata?: {
    model?: string
    confidence?: number
    processingTime?: number
    searchUsed?: boolean
    searchResults?: SearchResult[]
    categories?: string[]
    sentiment?: {
      score: number
      label: "positive" | "neutral" | "negative"
    }
  }
}

export interface ResponseFeedback {
  id: string
  responseId: string
  rating?: number // 0-1 scale
  comment?: string
  timestamp: number
  userId?: string
}

export interface UserSession {
  id: string
  startTime: number
  endTime?: number
  interactions: number
  userId?: string
  metadata?: Record<string, any>
}

export interface DatabaseStats {
  totalResponses: number
  totalFeedback: number
  averageRating: number
  topQueries: Array<{ query: string; count: number }>
  lastUpdated: number
}

// In-memory database
const responses: ResponseData[] = []
const feedback: ResponseFeedback[] = []
const sessions: UserSession[] = []

// Stats cache
const statsCache: DatabaseStats = {
  totalResponses: 0,
  totalFeedback: 0,
  averageRating: 0,
  topQueries: [],
  lastUpdated: Date.now(),
}
let isCacheValid = false

/**
 * Initialize the database
 */
export const initDatabase = (): void => {
  console.log("Database initialized")
}

/**
 * Add a response to the database
 */
export const addResponse = (data: Omit<ResponseData, "id">): string => {
  const id = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const responseData: ResponseData = {
    ...data,
    id,
  }
  responses.push(responseData)
  return id
}

/**
 * Get a response by ID
 */
export const getResponse = (id: string): ResponseData | undefined => {
  return responses.find((response) => response.id === id)
}

/**
 * Get all responses, optionally filtered and limited
 */
export const getResponses = (options?: {
  limit?: number
  offset?: number
  query?: string
  startDate?: number
  endDate?: number
}): ResponseData[] => {
  let result = [...responses]

  // Apply filters
  if (options?.query) {
    const query = options.query.toLowerCase()
    result = result.filter((response) => response.query.toLowerCase().includes(query))
  }

  if (options?.startDate) {
    result = result.filter((response) => response.timestamp >= (options.startDate || 0))
  }

  if (options?.endDate) {
    result = result.filter((response) => response.timestamp <= (options.endDate || Date.now()))
  }

  // Sort by timestamp (newest first)
  result.sort((a, b) => b.timestamp - a.timestamp)

  // Apply pagination
  if (options?.offset) {
    result = result.slice(options.offset)
  }

  if (options?.limit) {
    result = result.slice(0, options.limit)
  }

  return result
}

/**
 * Add feedback for a response
 */
export const addFeedback = (data: Omit<ResponseFeedback, "id">): string => {
  const id = `feed_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const feedbackData: ResponseFeedback = {
    ...data,
    id,
    timestamp: Date.now(),
  }
  feedback.push(feedbackData)
  return id
}

/**
 * Get feedback for a response
 */
export const getFeedback = (responseId: string): ResponseFeedback[] => {
  return feedback.filter((item) => item.responseId === responseId)
}

/**
 * Start a new user session
 */
export const startSession = (): string => {
  const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const session: UserSession = {
    id,
    startTime: Date.now(),
    interactions: 0,
  }
  sessions.push(session)
  return id
}

/**
 * Update a user session
 */
export const updateSession = (id: string, data: Partial<UserSession>): boolean => {
  const sessionIndex = sessions.findIndex((session) => session.id === id)
  if (sessionIndex === -1) return false

  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    ...data,
    interactions: (sessions[sessionIndex].interactions || 0) + 1,
  }
  return true
}

/**
 * End a user session
 */
export const endSession = (id: string): boolean => {
  const sessionIndex = sessions.findIndex((session) => session.id === id)
  if (sessionIndex === -1) return false

  sessions[sessionIndex].endTime = Date.now()
  return true
}

/**
 * Get database statistics
 */
export const getStats = (): DatabaseStats => {
  // If cache is valid, return it
  if (isCacheValid) {
    return { ...statsCache }
  }

  // Otherwise, recalculate stats
  updateStats()
  return { ...statsCache }
}

/**
 * Update statistics cache
 */
export const updateStats = (): void => {
  // Calculate total responses
  statsCache.totalResponses = responses.length

  // Calculate total feedback
  statsCache.totalFeedback = feedback.length

  // Calculate average rating
  let totalRating = 0
  let ratingCount = 0
  feedback.forEach((item) => {
    if (item.rating !== undefined) {
      totalRating += item.rating
      ratingCount++
    }
  })
  statsCache.averageRating = ratingCount > 0 ? totalRating / ratingCount : 0

  // Calculate top queries
  const queryCounts: Record<string, number> = {}
  responses.forEach((response) => {
    const query = response.query
    queryCounts[query] = (queryCounts[query] || 0) + 1
  })

  statsCache.topQueries = Object.entries(queryCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Keep only top 10

  // Update timestamp
  statsCache.lastUpdated = Date.now()

  // Mark cache as valid
  isCacheValid = true
}

/**
 * Invalidate the stats cache
 */
export const invalidateStatsCache = (): void => {
  isCacheValid = false
}

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
 * Get session statistics
 */
export const getSessionStats = (
  sessions: UserSession[],
): {
  totalSessions: number
  averageSessionLength: number
  averageInteractionsPerSession: number
  activeSessions: number
} => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageSessionLength: 0,
      averageInteractionsPerSession: 0,
      activeSessions: 0,
    }
  }

  const now = Date.now()
  const completedSessions = sessions.filter((s) => s.endTime !== undefined)
  const activeSessions = sessions.filter((s) => s.endTime === undefined)

  // Calculate average session length (in seconds)
  const totalSessionLength = completedSessions.reduce((total, session) => {
    return total + ((session.endTime || now) - session.startTime) / 1000
  }, 0)

  const averageSessionLength = completedSessions.length > 0 ? totalSessionLength / completedSessions.length : 0

  // Calculate average interactions per session
  const totalInteractions = sessions.reduce((total, session) => total + session.interactions, 0)
  const averageInteractionsPerSession = totalInteractions / sessions.length

  return {
    totalSessions: sessions.length,
    averageSessionLength,
    averageInteractionsPerSession,
    activeSessions: activeSessions.length,
  }
}

/**
 * Calculate sentiment distribution
 */
export const calculateSentimentDistribution = (
  responses: ResponseData[],
): {
  positive: number
  neutral: number
  negative: number
} => {
  let positive = 0
  let neutral = 0
  let negative = 0

  responses.forEach((response) => {
    const sentiment = response.metadata?.sentiment?.label
    if (sentiment === "positive") positive++
    else if (sentiment === "negative") negative++
    else neutral++
  })

  return { positive, neutral, negative }
}

/**
 * Calculate category distribution
 */
export const calculateCategoryDistribution = (responses: ResponseData[]): Record<string, number> => {
  const categories: Record<string, number> = {}

  responses.forEach((response) => {
    const responseCategories = response.metadata?.categories || []
    responseCategories.forEach((category) => {
      categories[category] = (categories[category] || 0) + 1
    })
  })

  return categories
}

/**
 * Calculate response time distribution
 */
export const calculateResponseTimeDistribution = (
  responses: ResponseData[],
): {
  fast: number
  medium: number
  slow: number
} => {
  let fast = 0
  let medium = 0
  let slow = 0

  responses.forEach((response) => {
    const processingTime = response.metadata?.processingTime || 0
    if (processingTime < 500) fast++
    else if (processingTime < 1000) medium++
    else slow++
  })

  return { fast, medium, slow }
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

/**
 * Clear the database
 */
export const clearDatabase = (): void => {
  responses.length = 0
  feedback.length = 0
  sessions.length = 0
  invalidateStatsCache()
}
