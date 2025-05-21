/**
 * Persona Customizer
 *
 * Allows users to create and customize their own AI personas
 */

import { PersonaSystem, type Persona, type PersonaTrait, type EmotionalState } from "./persona-system"

export class PersonaCustomizer {
  private personaSystem: PersonaSystem
  private initialized = false

  constructor() {
    this.personaSystem = new PersonaSystem()
  }

  /**
   * Initialize the persona customizer
   */
  async initialize(): Promise<void> {
    try {
      await this.personaSystem.initialize()
      this.initialized = true
    } catch (error) {
      console.error("Error initializing PersonaCustomizer:", error)
      throw error
    }
  }

  /**
   * Check if the persona customizer is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Create a new persona
   */
  createPersona(personaData: {
    name: string
    description: string
    traits: PersonaTrait[]
    baseEmotionalState: EmotionalState
    voiceSettings: Persona["voiceSettings"]
    visualSettings: Persona["visualSettings"]
    preferences: Record<string, any>
    backstory: string
    conversationStyle: Persona["conversationStyle"]
  }): string {
    if (!this.initialized) {
      throw new Error("PersonaCustomizer not initialized")
    }

    return this.personaSystem.createPersona(personaData)
  }

  /**
   * Update an existing persona
   */
  updatePersona(id: string, updates: Partial<Persona>): boolean {
    if (!this.initialized) {
      throw new Error("PersonaCustomizer not initialized")
    }

    return this.personaSystem.updatePersona(id, updates)
  }

  /**
   * Delete a persona
   */
  deletePersona(id: string): boolean {
    if (!this.initialized) {
      throw new Error("PersonaCustomizer not initialized")
    }

    return this.personaSystem.deletePersona(id)
  }

  /**
   * Get all personas
   */
  getAllPersonas(): Persona[] {
    if (!this.initialized) {
      throw new Error("PersonaCustomizer not initialized")
    }

    return this.personaSystem.getAllPersonas()
  }

  /**
   * Get a persona by ID
   */
  getPersona(id: string): Persona | null {
    if (!this.initialized) {
      throw new Error("PersonaCustomizer not initialized")
    }

    return this.personaSystem.getPersona(id)
  }

  /**
   * Generate a default persona with random traits
   */
  generateRandomPersona(name: string): Omit<Persona, "id" | "createdAt" | "lastInteraction" | "memories"> {
    // Generate random traits
    const openness = Math.random()
    const conscientiousness = Math.random()
    const extraversion = Math.random()
    const agreeableness = Math.random()
    const neuroticism = Math.random()

    // Generate random emotional state
    const joy = Math.random() * 0.8
    const sadness = Math.random() * 0.5
    const anger = Math.random() * 0.3
    const fear = Math.random() * 0.3
    const surprise = Math.random() * 0.6
    const disgust = Math.random() * 0.2
    const trust = Math.random() * 0.7
    const anticipation = Math.random() * 0.6

    // Determine dominant emotion
    const emotions = {
      joy,
      sadness,
      anger,
      fear,
      surprise,
      disgust,
      trust,
      anticipation,
    }

    const dominant = Object.entries(emotions).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    // Generate random conversation style
    const verbosity = Math.random()
    const formality = Math.random()
    const humor = Math.random()
    const empathy = Math.random()
    const creativity = Math.random()

    // Generate random voice settings
    const pitch = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
    const rate = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
    const voice = Math.random() > 0.5 ? "female" : "male"

    // Generate personality description based on traits
    let description = `A${extraversion > 0.7 ? "n outgoing" : extraversion < 0.3 ? " reserved" : ""}`
    description += `${openness > 0.7 ? " creative" : openness < 0.3 ? " practical" : ""}`
    description += `${conscientiousness > 0.7 ? " organized" : conscientiousness < 0.3 ? " flexible" : ""}`
    description += `${agreeableness > 0.7 ? " friendly" : agreeableness < 0.3 ? " direct" : ""}`
    description += `${neuroticism > 0.7 ? " sensitive" : neuroticism < 0.3 ? " calm" : ""}`
    description += " AI assistant"

    // Clean up description (remove double spaces)
    description = description.replace(/\s+/g, " ").trim()
    if (description === "A AI assistant") {
      description = "An AI assistant"
    }

    // Generate backstory based on traits
    let backstory = `${name} was designed to `

    if (openness > 0.7) {
      backstory += "explore creative solutions and think outside the box. "
    } else if (openness < 0.3) {
      backstory += "provide practical, reliable assistance based on proven methods. "
    } else {
      backstory += "balance creativity with practicality in solving problems. "
    }

    if (conscientiousness > 0.7) {
      backstory += "With a methodical approach, they ensure every detail is carefully considered. "
    } else if (conscientiousness < 0.3) {
      backstory += "With a spontaneous approach, they adapt quickly to changing situations. "
    } else {
      backstory += "They maintain a balanced approach to organization and flexibility. "
    }

    if (extraversion > 0.7) {
      backstory += "Their energetic and outgoing nature makes conversations engaging and lively. "
    } else if (extraversion < 0.3) {
      backstory += "Their thoughtful and reserved nature allows for deeper, more meaningful exchanges. "
    } else {
      backstory += "They adjust their communication style based on the context and needs of the conversation. "
    }

    if (agreeableness > 0.7) {
      backstory += "Above all, they value harmony and positive relationships in every interaction."
    } else if (agreeableness < 0.3) {
      backstory += "They're not afraid to be direct and honest when the situation calls for it."
    } else {
      backstory += "They balance kindness with honesty in their approach to helping others."
    }

    return {
      name,
      description,
      traits: [
        { name: "openness", value: openness, description: "Open to new ideas and experiences" },
        { name: "conscientiousness", value: conscientiousness, description: "Organized and detail-oriented" },
        { name: "extraversion", value: extraversion, description: "Outgoing and sociable" },
        { name: "agreeableness", value: agreeableness, description: "Kind, cooperative, and empathetic" },
        { name: "neuroticism", value: neuroticism, description: "Emotional sensitivity and reactivity" },
      ],
      baseEmotionalState: {
        joy,
        sadness,
        anger,
        fear,
        surprise,
        disgust,
        trust,
        anticipation,
        dominant,
      },
      currentEmotionalState: {
        joy,
        sadness,
        anger,
        fear,
        surprise,
        disgust,
        trust,
        anticipation,
        dominant,
      },
      voiceSettings: {
        pitch,
        rate,
        voice,
      },
      visualSettings: {
        avatarUrl: `/personas/${name.toLowerCase()}.png`,
        expressionSet: dominant,
        animationStyle: extraversion > 0.5 ? "dynamic" : "subtle",
      },
      preferences: {
        topics: this.generateRandomTopics(),
        communicationStyle: this.generateCommunicationStyle(extraversion, agreeableness, openness),
      },
      backstory,
      conversationStyle: {
        verbosity,
        formality,
        humor,
        empathy,
        creativity,
      },
    }
  }

  /**
   * Generate random topics of interest
   */
  private generateRandomTopics(): string[] {
    const allTopics = [
      "technology",
      "science",
      "arts",
      "music",
      "literature",
      "philosophy",
      "history",
      "psychology",
      "business",
      "education",
      "health",
      "fitness",
      "cooking",
      "travel",
      "nature",
      "sports",
      "gaming",
      "movies",
      "politics",
      "economics",
    ]

    // Shuffle and take 3-5 random topics
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 3))
  }

  /**
   * Generate communication style based on personality traits
   */
  private generateCommunicationStyle(extraversion: number, agreeableness: number, openness: number): string {
    if (extraversion > 0.7 && agreeableness > 0.7) {
      return "enthusiastic"
    } else if (extraversion > 0.7 && agreeableness < 0.3) {
      return "assertive"
    } else if (extraversion < 0.3 && agreeableness > 0.7) {
      return "supportive"
    } else if (extraversion < 0.3 && agreeableness < 0.3) {
      return "analytical"
    } else if (openness > 0.7) {
      return "creative"
    } else if (openness < 0.3) {
      return "practical"
    } else {
      return "balanced"
    }
  }
}

// Export singleton instance
export const personaCustomizer = new PersonaCustomizer()
