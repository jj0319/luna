/**
 * Database Store
 *
 * This module provides functions for storing and retrieving data from the database.
 */

import type { ResponseData, ResponseFeedback, UserSession, DatabaseStats } from "./schema"

// In-memory database
const responses: ResponseData[] = []
const feedback: ResponseFeedback[] = []
const sessions: UserSession[] = []

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
  // Calculate average rating
  let totalRating = 0
  let ratingCount = 0

  feedback.forEach((item) => {
    if (item.rating !== undefined) {
      totalRating += item.rating
      ratingCount++
    }
  })

  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0

  // Calculate top queries
  const queryCounts: Record<string, number> = {}
  responses.forEach((response) => {
    const query = response.query
    queryCounts[query] = (queryCounts[query] || 0) + 1
  })

  const topQueries = Object.entries(queryCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Keep only top 10

  return {
    totalResponses: responses.length,
    totalFeedback: feedback.length,
    averageRating,
    topQueries,
    lastUpdated: Date.now(),
  }
}

/**
 * Clear the database
 */
export const clearDatabase = (): void => {
  responses.length = 0
  feedback.length = 0
  sessions.length = 0
}
