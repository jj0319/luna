/**
 * Database Statistics
 *
 * This module provides functions for calculating and retrieving
 * statistics about the database.
 */

import type { DatabaseStats, ResponseData, UserSession } from "./schema"
import { getResponses } from "./store"

// In-memory cache of statistics
const statsCache: DatabaseStats = {
  totalResponses: 0,
  totalFeedback: 0,
  averageRating: 0,
  topQueries: [],
  lastUpdated: Date.now(),
}

// Flag to indicate if cache is valid
let isCacheValid = false

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
  const responses = getResponses()

  // Calculate total responses
  statsCache.totalResponses = responses.length

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
