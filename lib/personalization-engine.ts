/**
 * Personalization Engine
 *
 * Adapts responses to individual user preferences
 */

interface UserProfile {
  id: string
  preferences: Record<string, any>
  interactions: number
  lastInteraction: number
  topics: Record<string, number>
}

export class PersonalizationEngine {
  private profiles: Map<string, UserProfile> = new Map()
  private defaultUserId = "default"
  private initialized = false

  constructor() {
    // Initialize with empty profiles
  }

  /**
   * Initialize the personalization engine
   */
  async initialize(): Promise<void> {
    try {
      // Load from localStorage if available
      if (typeof window !== "undefined") {
        const savedProfiles = localStorage.getItem("personalizationEngine_profiles")

        if (savedProfiles) {
          this.profiles = new Map(JSON.parse(savedProfiles))
        }

        // Create default profile if it doesn't exist
        if (!this.profiles.has(this.defaultUserId)) {
          this.profiles.set(this.defaultUserId, {
            id: this.defaultUserId,
            preferences: {
              verbosity: 0.5,
              formality: 0.5,
              techLevel: 0.5,
            },
            interactions: 0,
            lastInteraction: Date.now(),
            topics: {},
          })
        }
      }

      this.initialized = true
    } catch (error) {
      console.error("Error initializing PersonalizationEngine:", error)
      throw error
    }
  }

  /**
   * Check if the personalization engine is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Get or create a user profile
   */
  getProfile(userId: string = this.defaultUserId): UserProfile {
    if (!this.profiles.has(userId)) {
      // Create new profile based on default
      const defaultProfile = this.profiles.get(this.defaultUserId)!

      this.profiles.set(userId, {
        id: userId,
        preferences: { ...defaultProfile.preferences },
        interactions: 0,
        lastInteraction: Date.now(),
        topics: {},
      })

      this.saveToStorage()
    }

    return this.profiles.get(userId)!
  }

  /**
   * Update a user preference
   */
  updatePreference(userId: string, key: string, value: any): void {
    const profile = this.getProfile(userId)
    profile.preferences[key] = value
    profile.lastInteraction = Date.now()
    this.saveToStorage()
  }

  /**
   * Record a user interaction with a topic
   */
  recordInteraction(userId: string, topic: string): void {
    const profile = this.getProfile(userId)
    profile.interactions++
    profile.lastInteraction = Date.now()
    profile.topics[topic] = (profile.topics[topic] || 0) + 1
    this.saveToStorage()
  }

  /**
   * Get personalization data for a message
   */
  getPersonalization(text: string, userId: string = this.defaultUserId): Record<string, any> {
    const profile = this.getProfile(userId)

    // Extract topics from text
    const topics = this.extractTopics(text)

    // Record interaction with these topics
    for (const topic of topics) {
      this.recordInteraction(userId, topic)
    }

    return {
      preferences: profile.preferences,
      topInterests: this.getTopInterests(userId),
      interactionCount: profile.interactions,
    }
  }

  /**
   * Extract topics from text
   */
  private extractTopics(text: string): string[] {
    // Simple topic extraction
    const topics = []

    if (text.toLowerCase().includes("tech") || text.toLowerCase().includes("technology")) {
      topics.push("technology")
    }

    if (text.toLowerCase().includes("science")) {
      topics.push("science")
    }

    if (text.toLowerCase().includes("art") || text.toLowerCase().includes("design")) {
      topics.push("art")
    }

    if (text.toLowerCase().includes("music")) {
      topics.push("music")
    }

    if (text.toLowerCase().includes("sport")) {
      topics.push("sports")
    }

    // Default topic if none detected
    if (topics.length === 0) {
      topics.push("general")
    }

    return topics
  }

  /**
   * Get top interests for a user
   */
  private getTopInterests(userId: string): string[] {
    const profile = this.getProfile(userId)

    return Object.entries(profile.topics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic)
  }

  /**
   * Personalize a response based on user preferences
   */
  personalizeResponse(response: string, userId: string = this.defaultUserId): string {
    const profile = this.getProfile(userId)
    const { verbosity, formality, techLevel } = profile.preferences

    let personalizedResponse = response

    // Adjust verbosity
    if (verbosity < 0.3) {
      // Make more concise
      personalizedResponse = this.makeConcise(personalizedResponse)
    } else if (verbosity > 0.7) {
      // Make more verbose
      personalizedResponse = this.makeVerbose(personalizedResponse)
    }

    // Adjust formality
    if (formality < 0.3) {
      // Make more casual
      personalizedResponse = this.makeCasual(personalizedResponse)
    } else if (formality > 0.7) {
      // Make more formal
      personalizedResponse = this.makeFormal(personalizedResponse)
    }

    // Adjust technical level
    if (techLevel > 0.7 && this.containsTechnicalContent(response)) {
      // Add technical details
      personalizedResponse = this.addTechnicalDetails(personalizedResponse)
    }

    return personalizedResponse
  }

  /**
   * Make text more concise
   */
  private makeConcise(text: string): string {
    // Simple implementation - remove filler phrases
    const fillerPhrases = [
      "I think that ",
      "It seems like ",
      "You could say that ",
      "In my opinion, ",
      "As I see it, ",
      "From my perspective, ",
    ]

    let result = text
    for (const phrase of fillerPhrases) {
      result = result.replace(new RegExp(phrase, "gi"), "")
    }

    return result
  }

  /**
   * Make text more verbose
   */
  private makeVerbose(text: string): string {
    // Simple implementation - add an elaboration
    const elaborations = [
      " To elaborate a bit more on this point,",
      " I'd like to add some additional context here.",
      " Let me explain this in more detail.",
      " This is particularly important to understand.",
      " There are several aspects to consider here.",
    ]

    // Find a sentence to elaborate on
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    if (sentences.length > 1) {
      const randomSentenceIndex = Math.floor(Math.random() * (sentences.length - 1))
      const elaboration = elaborations[Math.floor(Math.random() * elaborations.length)]

      sentences[randomSentenceIndex] = sentences[randomSentenceIndex] + elaboration
      return sentences.join(" ")
    }

    return text
  }

  /**
   * Make text more casual
   */
  private makeCasual(text: string): string {
    // Simple implementation - replace formal words with casual ones
    const replacements: [RegExp, string][] = [
      [/\bHello\b/g, "Hi"],
      [/\bGood day\b/g, "Hey"],
      [/\bI am\b/g, "I'm"],
      [/\bYou are\b/g, "You're"],
      [/\bIt is\b/g, "It's"],
      [/\bCannot\b/g, "Can't"],
      [/\bDo not\b/g, "Don't"],
      [/\bWill not\b/g, "Won't"],
      [/\bThank you\b/g, "Thanks"],
      [/\bGoodbye\b/g, "Bye"],
    ]

    let result = text
    for (const [pattern, replacement] of replacements) {
      result = result.replace(pattern, replacement)
    }

    return result
  }

  /**
   * Make text more formal
   */
  private makeFormal(text: string): string {
    // Simple implementation - replace casual words with formal ones
    const replacements: [RegExp, string][] = [
      [/\bHi\b/g, "Hello"],
      [/\bHey\b/g, "Good day"],
      [/\bI'm\b/g, "I am"],
      [/\bYou're\b/g, "You are"],
      [/\bIt's\b/g, "It is"],
      [/\bCan't\b/g, "Cannot"],
      [/\bDon't\b/g, "Do not"],
      [/\bWon't\b/g, "Will not"],
      [/\bThanks\b/g, "Thank you"],
      [/\bBye\b/g, "Goodbye"],
    ]

    let result = text
    for (const [pattern, replacement] of replacements) {
      result = result.replace(pattern, replacement)
    }

    return result
  }

  /**
   * Check if text contains technical content
   */
  private containsTechnicalContent(text: string): boolean {
    const technicalTerms = [
      "algorithm",
      "function",
      "variable",
      "database",
      "server",
      "client",
      "api",
      "interface",
      "component",
      "module",
      "library",
      "framework",
      "architecture",
      "protocol",
      "system",
    ]

    const lowerText = text.toLowerCase()
    return technicalTerms.some((term) => lowerText.includes(term))
  }

  /**
   * Add technical details to text
   */
  private addTechnicalDetails(text: string): string {
    // Simple implementation - add a technical note
    const technicalNotes = [
      " (This involves advanced algorithms for optimal processing.)",
      " (The underlying architecture supports this through efficient data structures.)",
      " (This leverages modern frameworks for maximum performance.)",
      " (The system implements this using best practices in software design.)",
      " (This approach optimizes for both speed and reliability.)",
    ]

    const randomNote = technicalNotes[Math.floor(Math.random() * technicalNotes.length)]

    // Add to the end of a relevant sentence
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    if (sentences.length > 0) {
      const targetSentence = this.findMostTechnicalSentence(sentences)
      const targetIndex = sentences.indexOf(targetSentence)

      if (targetIndex >= 0) {
        sentences[targetIndex] = targetSentence.replace(/[.!?]+$/, randomNote + ".")
        return sentences.join(" ")
      }
    }

    return text
  }

  /**
   * Find the most technical sentence in a list
   */
  private findMostTechnicalSentence(sentences: string[]): string {
    const technicalTerms = [
      "algorithm",
      "function",
      "variable",
      "database",
      "server",
      "client",
      "api",
      "interface",
      "component",
      "module",
      "library",
      "framework",
      "architecture",
      "protocol",
      "system",
    ]

    let mostTechnicalSentence = sentences[0]
    let highestScore = 0

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase()
      let score = 0

      for (const term of technicalTerms) {
        if (lowerSentence.includes(term)) {
          score++
        }
      }

      if (score > highestScore) {
        highestScore = score
        mostTechnicalSentence = sentence
      }
    }

    return mostTechnicalSentence
  }

  /**
   * Get the number of user profiles
   */
  getProfileCount(): number {
    return this.profiles.size
  }

  /**
   * Get the total number of preferences across all users
   */
  getPreferenceCount(): number {
    let count = 0
    for (const profile of this.profiles.values()) {
      count += Object.keys(profile.preferences).length
    }
    return count
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("personalizationEngine_profiles", JSON.stringify([...this.profiles.entries()]))
    }
  }

  /**
   * Convert personalization engine to JSON
   */
  toJSON(): string {
    return JSON.stringify({
      profiles: [...this.profiles.entries()],
    })
  }

  /**
   * Load personalization engine from JSON
   */
  fromJSON(json: string): void {
    const data = JSON.parse(json)
    this.profiles = new Map(data.profiles || [])
    this.initialized = true
  }
}
