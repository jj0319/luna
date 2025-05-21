/**
 * Neural Learning Store
 *
 * Enhanced learning store that uses neural networks for more sophisticated learning.
 */

import { NeuralNetwork } from "@/lib/neural-network"
import { TextEmbedder, sentimentFeatures } from "@/lib/text-embedding"
import {
  recordInteraction as baseRecordInteraction,
  recordFeedback as baseRecordFeedback,
  getLearningStats as baseGetLearningStats,
  resetLearningStore as baseResetLearningStore,
  findRelevantKnowledge,
  getSimilarQueries,
  type KnowledgeItem,
  type LearningEntry,
  type Feedback,
} from "@/lib/learning-store"

// Neural network models
let responseQualityNetwork: NeuralNetwork | null = null
let contentCategoryNetwork: NeuralNetwork | null = null
let textEmbedder: TextEmbedder | null = null

// Local storage keys for neural models
const RESPONSE_QUALITY_NETWORK_KEY = "ai_response_quality_network"
const CONTENT_CATEGORY_NETWORK_KEY = "ai_content_category_network"
const TEXT_EMBEDDER_KEY = "ai_text_embedder"

// Training data
let responseQualityTrainingData: [number[], number[]][] = []
let contentCategoryTrainingData: [number[], number[]][] = []

// Category mapping
const CATEGORIES = ["definition", "how-to", "reasoning", "temporal", "location", "person", "philosophical", "general"]

// Initialize neural networks
const initializeNeuralNetworks = () => {
  if (typeof window !== "undefined") {
    try {
      // Try to load existing models from localStorage
      const storedResponseQualityNetwork = localStorage.getItem(RESPONSE_QUALITY_NETWORK_KEY)
      const storedContentCategoryNetwork = localStorage.getItem(CONTENT_CATEGORY_NETWORK_KEY)
      const storedTextEmbedder = localStorage.getItem(TEXT_EMBEDDER_KEY)

      if (storedResponseQualityNetwork) {
        responseQualityNetwork = NeuralNetwork.fromJSON(storedResponseQualityNetwork)
      } else {
        // Create a new response quality network
        responseQualityNetwork = new NeuralNetwork({
          inputSize: 5, // Sentiment features
          hiddenLayers: [8, 4],
          outputSize: 1, // Quality score (0-1)
          activation: "sigmoid",
          learningRate: 0.05,
        })
      }

      if (storedTextEmbedder) {
        textEmbedder = TextEmbedder.fromJSON(storedTextEmbedder)
      } else {
        // Create a new text embedder
        textEmbedder = new TextEmbedder(50)
      }

      if (storedContentCategoryNetwork && textEmbedder.getVocabSize() > 0) {
        contentCategoryNetwork = NeuralNetwork.fromJSON(storedContentCategoryNetwork)
      } else if (textEmbedder.getVocabSize() > 0) {
        // Create a new content category network
        contentCategoryNetwork = new NeuralNetwork({
          inputSize: textEmbedder.getVocabSize(),
          hiddenLayers: [20, 12],
          outputSize: CATEGORIES.length,
          activation: "sigmoid",
          learningRate: 0.03,
        })
      }
    } catch (error) {
      console.error("Error initializing neural networks:", error)

      // Create new networks if loading failed
      responseQualityNetwork = new NeuralNetwork({
        inputSize: 5, // Sentiment features
        hiddenLayers: [8, 4],
        outputSize: 1, // Quality score (0-1)
        activation: "sigmoid",
        learningRate: 0.05,
      })

      textEmbedder = new TextEmbedder(50)
    }
  }
}

// Save neural networks to localStorage
const saveNeuralNetworks = () => {
  if (typeof window !== "undefined") {
    try {
      if (responseQualityNetwork) {
        localStorage.setItem(RESPONSE_QUALITY_NETWORK_KEY, responseQualityNetwork.toJSON())
      }

      if (contentCategoryNetwork) {
        localStorage.setItem(CONTENT_CATEGORY_NETWORK_KEY, contentCategoryNetwork.toJSON())
      }

      if (textEmbedder) {
        localStorage.setItem(TEXT_EMBEDDER_KEY, textEmbedder.toJSON())
      }
    } catch (error) {
      console.error("Error saving neural networks:", error)
    }
  }
}

/**
 * Record an interaction with neural learning
 */
export const recordInteraction = (query: string, response: string, tags: string[] = []): string => {
  // Record in base learning store
  const entryId = baseRecordInteraction(query, response, tags)

  // Update text embedder vocabulary
  if (textEmbedder) {
    // Build or update vocabulary
    const allTexts = [query, response]
    textEmbedder.buildVocabulary(allTexts)

    // If we have enough data, create the content category network
    if (!contentCategoryNetwork && textEmbedder.getVocabSize() > 0) {
      contentCategoryNetwork = new NeuralNetwork({
        inputSize: textEmbedder.getVocabSize(),
        hiddenLayers: [20, 12],
        outputSize: CATEGORIES.length,
        activation: "sigmoid",
        learningRate: 0.03,
      })
    }

    // Save the updated embedder
    saveNeuralNetworks()
  }

  return entryId
}

/**
 * Record feedback with neural learning
 */
export const recordFeedback = (messageId: string, rating: "positive" | "negative"): boolean => {
  // Record in base learning store
  const result = baseRecordFeedback(messageId, rating)

  if (result && responseQualityNetwork) {
    // Get the message content
    const message = findMessageById(messageId)

    if (message) {
      // Extract sentiment features
      const features = sentimentFeatures.extractFeatures(message)

      // Create training example
      const target = [rating === "positive" ? 1 : 0]

      // Add to training data
      responseQualityTrainingData.push([features, target])

      // Train the network if we have enough data
      if (responseQualityTrainingData.length >= 5) {
        responseQualityNetwork.trainBatch(responseQualityTrainingData, 10)
        saveNeuralNetworks()
      }
    }
  }

  return result
}

/**
 * Find a message by ID in the learning store
 */
const findMessageById = (messageId: string): string | null => {
  // This is a simplified implementation
  // In a real system, you would query your database
  return null
}

/**
 * Predict response quality using the neural network
 */
export const predictResponseQuality = (text: string): number => {
  if (!responseQualityNetwork) {
    return 0.5 // Default neutral score
  }

  const features = sentimentFeatures.extractFeatures(text)
  const prediction = responseQualityNetwork.predict(features)

  return prediction[0]
}

/**
 * Predict content category using the neural network
 */
export const predictContentCategory = (text: string): { category: string; confidence: number }[] => {
  if (!contentCategoryNetwork || !textEmbedder || textEmbedder.getVocabSize() === 0) {
    return [{ category: "general", confidence: 1.0 }]
  }

  try {
    const vector = textEmbedder.textToVector(text)
    const prediction = contentCategoryNetwork.predict(vector)

    // Convert to category-confidence pairs
    return prediction
      .map((confidence, index) => ({
        category: CATEGORIES[index],
        confidence,
      }))
      .sort((a, b) => b.confidence - a.confidence)
  } catch (error) {
    console.error("Error predicting content category:", error)
    return [{ category: "general", confidence: 1.0 }]
  }
}

/**
 * Train the neural networks with all available data
 */
export const trainNeuralNetworks = async (): Promise<{
  responseQualityError: number
  contentCategoryError: number
}> => {
  let responseQualityError = 0
  let contentCategoryError = 0

  // Train response quality network
  if (responseQualityNetwork && responseQualityTrainingData.length > 0) {
    const errors = responseQualityNetwork.trainBatch(responseQualityTrainingData, 50)
    responseQualityError = errors[errors.length - 1]
  }

  // Train content category network
  if (contentCategoryNetwork && contentCategoryTrainingData.length > 0) {
    const errors = contentCategoryNetwork.trainBatch(contentCategoryTrainingData, 50)
    contentCategoryError = errors[errors.length - 1]
  }

  // Save the trained networks
  saveNeuralNetworks()

  return {
    responseQualityError,
    contentCategoryError,
  }
}

/**
 * Get neural learning stats
 */
export const getNeuralLearningStats = () => {
  const baseStats = baseGetLearningStats()

  return {
    ...baseStats,
    neuralNetworks: {
      responseQuality: responseQualityNetwork
        ? {
            architecture: responseQualityNetwork.getArchitecture(),
            trainingExamples: responseQualityTrainingData.length,
          }
        : null,
      contentCategory: contentCategoryNetwork
        ? {
            architecture: contentCategoryNetwork.getArchitecture(),
            trainingExamples: contentCategoryTrainingData.length,
          }
        : null,
      textEmbedder: textEmbedder
        ? {
            vocabularySize: textEmbedder.getVocabSize(),
          }
        : null,
    },
  }
}

/**
 * Reset the neural learning store
 */
export const resetNeuralLearningStore = () => {
  // Reset base learning store
  baseResetLearningStore()

  // Reset neural networks
  responseQualityNetwork = new NeuralNetwork({
    inputSize: 5,
    hiddenLayers: [8, 4],
    outputSize: 1,
    activation: "sigmoid",
    learningRate: 0.05,
  })

  textEmbedder = new TextEmbedder(50)

  contentCategoryNetwork = null
  responseQualityTrainingData = []
  contentCategoryTrainingData = []

  // Save reset networks
  saveNeuralNetworks()
}

// Re-export base functions
export { findRelevantKnowledge, getSimilarQueries, type KnowledgeItem, type LearningEntry, type Feedback }

// Initialize on module load
initializeNeuralNetworks()
