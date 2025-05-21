/**
 * Text Embedding Utilities
 *
 * This module provides functionality for converting text to vector representations
 * and extracting features from text for machine learning purposes.
 */

// Simple text embedder that builds a vocabulary and converts text to vectors
export class TextEmbedder {
  private vocabulary: Map<string, number> = new Map()
  private vocabSize = 0
  private readonly maxVocabSize: number

  constructor(maxVocabSize = 1000) {
    this.maxVocabSize = maxVocabSize
  }

  // Build vocabulary from a list of texts
  buildVocabulary(texts: string[]): void {
    // Tokenize and count words
    const wordCounts: Map<string, number> = new Map()

    texts.forEach((text) => {
      const words = this.tokenize(text)
      words.forEach((word) => {
        const count = wordCounts.get(word) || 0
        wordCounts.set(word, count + 1)
      })
    })

    // Sort words by frequency
    const sortedWords = [...wordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxVocabSize)
      .map((entry) => entry[0])

    // Build vocabulary map (word -> index)
    this.vocabulary = new Map()
    sortedWords.forEach((word, index) => {
      this.vocabulary.set(word, index)
    })

    this.vocabSize = this.vocabulary.size
  }

  // Convert text to a vector representation
  textToVector(text: string): number[] {
    if (this.vocabSize === 0) {
      throw new Error("Vocabulary not built. Call buildVocabulary first.")
    }

    const vector = new Array(this.vocabSize).fill(0)
    const words = this.tokenize(text)

    words.forEach((word) => {
      const index = this.vocabulary.get(word)
      if (index !== undefined) {
        vector[index] += 1
      }
    })

    // Normalize the vector
    const sum = vector.reduce((acc, val) => acc + val, 0)
    if (sum > 0) {
      return vector.map((val) => val / sum)
    }

    return vector
  }

  // Get the size of the vocabulary
  getVocabSize(): number {
    return this.vocabSize
  }

  // Tokenize text into words
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2)
  }

  // Serialize to JSON
  toJSON(): string {
    return JSON.stringify({
      vocabulary: Array.from(this.vocabulary.entries()),
      vocabSize: this.vocabSize,
      maxVocabSize: this.maxVocabSize,
    })
  }

  // Create from JSON
  static fromJSON(json: string): TextEmbedder {
    const data = JSON.parse(json)
    const embedder = new TextEmbedder(data.maxVocabSize)
    embedder.vocabulary = new Map(data.vocabulary)
    embedder.vocabSize = data.vocabSize
    return embedder
  }
}

// Sentiment feature extractor
export const sentimentFeatures = {
  // Extract features from text for sentiment analysis
  extractFeatures(text: string): number[] {
    const features = []

    // Feature 1: Text length
    features.push(this.normalizeLength(text.length))

    // Feature 2: Question mark count
    features.push(this.normalizeCount(text.match(/\?/g)?.length || 0))

    // Feature 3: Exclamation mark count
    features.push(this.normalizeCount(text.match(/!/g)?.length || 0))

    // Feature 4: Positive word ratio
    features.push(this.positiveWordRatio(text))

    // Feature 5: Negative word ratio
    features.push(this.negativeWordRatio(text))

    return features
  },

  // Normalize text length to a value between 0 and 1
  normalizeLength(length: number): number {
    // Normalize to a value between 0 and 1 (assuming most texts are under 1000 chars)
    return Math.min(length / 1000, 1)
  },

  // Normalize count to a value between 0 and 1
  normalizeCount(count: number): number {
    // Normalize to a value between 0 and 1 (assuming most counts are under 10)
    return Math.min(count / 10, 1)
  },

  // Calculate ratio of positive words
  positiveWordRatio(text: string): number {
    const words = text.toLowerCase().split(/\s+/)
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
      "happy",
      "pleased",
      "delighted",
      "satisfied",
      "glad",
      "positive",
      "perfect",
      "awesome",
      "love",
      "like",
    ]

    const positiveCount = words.filter((word) => positiveWords.includes(word)).length
    return positiveCount / Math.max(words.length, 1)
  },

  // Calculate ratio of negative words
  negativeWordRatio(text: string): number {
    const words = text.toLowerCase().split(/\s+/)
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "poor",
      "disappointing",
      "frustrating",
      "annoying",
      "unpleasant",
      "negative",
      "sad",
      "unhappy",
      "angry",
      "upset",
      "disappointed",
      "hate",
      "dislike",
      "worst",
      "failure",
      "problem",
    ]

    const negativeCount = words.filter((word) => negativeWords.includes(word)).length
    return negativeCount / Math.max(words.length, 1)
  },
}
