/**
 * Database Index
 *
 * This file exports all database-related functionality.
 */

// Export from store
export {
  initDatabase,
  addResponse,
  getResponse,
  getResponses,
  addFeedback,
  getFeedback,
  startSession,
  updateSession,
  endSession,
  getStats,
  clearDatabase,
} from "./store"

// Export from utils
export {
  extractKeywords,
  findSimilarResponses,
  calculateSentiment,
  saveInteraction,
  exportDatabase,
  generateReport,
} from "./utils"

// Export from stats
export {
  updateStats,
  invalidateStatsCache,
  getSessionStats,
  calculateSentimentDistribution,
  calculateCategoryDistribution,
  calculateResponseTimeDistribution,
} from "./stats"

// Export from schema
export type {
  ResponseData,
  ResponseFeedback,
  UserSession,
  DatabaseStats,
  SearchResult,
} from "./schema"
