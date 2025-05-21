/**
 * Database Schema
 *
 * This file defines the types and interfaces for the database.
 */

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
