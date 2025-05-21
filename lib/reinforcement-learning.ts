/**
 * Reinforcement Learning
 *
 * Learns from rewards and feedback to improve responses over time.
 */

// Action type
export type ActionType = "response_generation" | "question_asking" | "topic_selection" | "style_selection"

// State interface
export interface State {
  id: string
  features: number[]
  description: string
}

// Action interface
export interface Action {
  id: string
  type: ActionType
  features: number[]
  description: string
}

// Episode interface
export interface Episode {
  id: string
  stateId: string
  actionId: string
  reward: number
  nextStateId?: string
  timestamp: number
}

// Q-value interface
export interface QValue {
  stateId: string
  actionId: string
  value: number
  updateCount: number
}

export class ReinforcementLearner {
  private states: Map<string, State> = new Map()
  private actions: Map<string, Action> = new Map()
  private episodes: Episode[] = []
  private qValues: Map<string, QValue> = new Map()
  private initialized = false
  private learningRate = 0.1
  private discountFactor = 0.9
  private explorationRate = 0.2
  private totalReward = 0

  constructor() {}

  // Initialize the reinforcement learner
  public async initialize(): Promise<void> {
    // Load existing data
    this.loadFromStorage()

    // Add basic actions if none exist
    if (this.actions.size === 0) {
      this.addBasicActions()
    }

    this.initialized = true
  }

  // Check if initialized
  public isInitialized(): boolean {
    return this.initialized
  }

  // Add a state
  public addState(features: number[], description: string): string {
    const id = this.generateId("state")

    const state: State = {
      id,
      features,
      description,
    }

    this.states.set(id, state)
    this.saveToStorage()

    return id
  }

  // Add an action
  public addAction(type: ActionType, features: number[], description: string): string {
    const id = this.generateId("action")

    const action: Action = {
      id,
      type,
      features,
      description,
    }

    this.actions.set(id, action)
    this.saveToStorage()

    return id
  }

  // Record an episode
  public recordEpisode(stateId: string, actionId: string, reward: number, nextStateId?: string): string {
    if (!this.states.has(stateId) || !this.actions.has(actionId)) {
      throw new Error("State or action does not exist")
    }

    if (nextStateId && !this.states.has(nextStateId)) {
      throw new Error("Next state does not exist")
    }

    const id = this.generateId("episode")

    const episode: Episode = {
      id,
      stateId,
      actionId,
      reward,
      nextStateId,
      timestamp: Date.now(),
    }

    this.episodes.push(episode)
    this.totalReward += reward

    // Update Q-value
    this.updateQValue(stateId, actionId, reward, nextStateId)

    this.saveToStorage()

    return id
  }

  // Process feedback
  public processFeedback(feedback: any): void {
    if (!this.initialized) {
      throw new Error("Reinforcement learner not initialized")
    }

    // Extract state features from feedback
    const stateFeatures = this.extractStateFeatures(feedback)

    // Find or create state
    let stateId = this.findSimilarState(stateFeatures)

    if (!stateId) {
      stateId = this.addState(stateFeatures, feedback.context || "Unknown context")
    }

    // Extract action features from feedback
    const actionFeatures = this.extractActionFeatures(feedback)

    // Find or create action
    let actionId = this.findSimilarAction(actionFeatures, feedback.actionType || "response_generation")

    if (!actionId) {
      actionId = this.addAction(
        feedback.actionType || "response_generation",
        actionFeatures,
        feedback.action || "Unknown action",
      )
    }

    // Calculate reward
    const reward = this.calculateReward(feedback)

    // Record episode
    this.recordEpisode(stateId, actionId, reward)
  }

  // Select best action for a state
  public selectAction(stateFeatures: number[], actionType?: ActionType): Action {
    if (!this.initialized) {
      throw new Error("Reinforcement learner not initialized")
    }

    // Find or create state
    let stateId = this.findSimilarState(stateFeatures)

    if (!stateId) {
      stateId = this.addState(stateFeatures, "Dynamic state")
    }

    // Exploration: randomly select an action
    if (Math.random() < this.explorationRate) {
      const eligibleActions = Array.from(this.actions.values()).filter(
        (action) => !actionType || action.type === actionType,
      )

      if (eligibleActions.length === 0) {
        throw new Error("No eligible actions available")
      }

      return eligibleActions[Math.floor(Math.random() * eligibleActions.length)]
    }

    // Exploitation: select action with highest Q-value
    const stateActions = Array.from(this.qValues.values()).filter((qValue) => qValue.stateId === stateId)

    if (stateActions.length === 0) {
      // No Q-values for this state, select random action
      const eligibleActions = Array.from(this.actions.values()).filter(
        (action) => !actionType || action.type === actionType,
      )

      if (eligibleActions.length === 0) {
        throw new Error("No eligible actions available")
      }

      return eligibleActions[Math.floor(Math.random() * eligibleActions.length)]
    }

    // Filter by action type if specified
    let filteredStateActions = stateActions

    if (actionType) {
      filteredStateActions = stateActions.filter((qValue) => {
        const action = this.actions.get(qValue.actionId)
        return action && action.type === actionType
      })

      if (filteredStateActions.length === 0) {
        // No Q-values for this state and action type, select random action
        const eligibleActions = Array.from(this.actions.values()).filter((action) => action.type === actionType)

        if (eligibleActions.length === 0) {
          throw new Error("No eligible actions available")
        }

        return eligibleActions[Math.floor(Math.random() * eligibleActions.length)]
      }
    }

    // Sort by Q-value
    filteredStateActions.sort((a, b) => b.value - a.value)

    // Get action with highest Q-value
    const bestAction = this.actions.get(filteredStateActions[0].actionId)

    if (!bestAction) {
      throw new Error("Action not found")
    }

    return bestAction
  }

  // Get episode count
  public getEpisodeCount(): number {
    return this.episodes.length
  }

  // Get total reward
  public getTotalReward(): number {
    return this.totalReward
  }

  // Extract state features from feedback
  private extractStateFeatures(feedback: any): number[] {
    // This is a simplified extraction
    // In a real implementation, this would use more sophisticated techniques

    const features: number[] = []

    // Feature 1: Message length (normalized)
    if (feedback.message) {
      features.push(Math.min(feedback.message.length / 500, 1))
    } else {
      features.push(0.5) // Default value
    }

    // Feature 2: Question presence
    if (feedback.message && feedback.message.includes("?")) {
      features.push(1)
    } else {
      features.push(0)
    }

    // Feature 3: User sentiment (if available)
    if (feedback.sentiment !== undefined) {
      features.push(feedback.sentiment)
    } else {
      features.push(0.5) // Neutral sentiment
    }

    // Feature 4: User expertise level (if available)
    if (feedback.expertiseLevel !== undefined) {
      features.push(feedback.expertiseLevel)
    } else {
      features.push(0.5) // Medium expertise
    }

    // Feature 5: Topic complexity (if available)
    if (feedback.topicComplexity !== undefined) {
      features.push(feedback.topicComplexity)
    } else {
      features.push(0.5) // Medium complexity
    }

    return features
  }

  // Extract action features from feedback
  private extractActionFeatures(feedback: any): number[] {
    // This is a simplified extraction
    // In a real implementation, this would use more sophisticated techniques

    const features: number[] = []

    // Feature 1: Response length (normalized)
    if (feedback.response) {
      features.push(Math.min(feedback.response.length / 1000, 1))
    } else {
      features.push(0.5) // Default value
    }

    // Feature 2: Response complexity
    if (feedback.responseComplexity !== undefined) {
      features.push(feedback.responseComplexity)
    } else {
      features.push(0.5) // Medium complexity
    }

    // Feature 3: Response formality
    if (feedback.responseFormality !== undefined) {
      features.push(feedback.responseFormality)
    } else {
      features.push(0.5) // Medium formality
    }

    // Feature 4: Response directness
    if (feedback.responseDirectness !== undefined) {
      features.push(feedback.responseDirectness)
    } else {
      features.push(0.5) // Medium directness
    }

    // Feature 5: Response helpfulness
    if (feedback.responseHelpfulness !== undefined) {
      features.push(feedback.responseHelpfulness)
    } else {
      features.push(0.5) // Medium helpfulness
    }

    return features
  }

  // Calculate reward from feedback
  private calculateReward(feedback: any): number {
    // This is a simplified calculation
    // In a real implementation, this would use more sophisticated techniques

    let reward = 0

    // Explicit feedback
    if (feedback.rating !== undefined) {
      reward += feedback.rating * 2 - 1 // Convert 0-1 rating to -1 to 1 range
    }

    // Implicit feedback
    if (feedback.userEngagement !== undefined) {
      reward += feedback.userEngagement * 0.5 // 0-0.5 range
    }

    if (feedback.timeSpent !== undefined) {
      reward += Math.min(feedback.timeSpent / 60, 1) * 0.3 // 0-0.3 range
    }

    if (feedback.clickedLinks !== undefined) {
      reward += feedback.clickedLinks ? 0.2 : 0
    }

    return reward
  }

  // Find similar state
  private findSimilarState(features: number[]): string | null {
    if (this.states.size === 0) {
      return null
    }

    let bestStateId: string | null = null
    let bestSimilarity = -1

    for (const [id, state] of this.states.entries()) {
      if (state.features.length !== features.length) {
        continue
      }

      const similarity = this.calculateCosineSimilarity(state.features, features)

      if (similarity > bestSimilarity && similarity > 0.9) {
        bestSimilarity = similarity
        bestStateId = id
      }
    }

    return bestStateId
  }

  // Find similar action
  private findSimilarAction(features: number[], type: ActionType): string | null {
    const actionsOfType = Array.from(this.actions.values()).filter((action) => action.type === type)

    if (actionsOfType.length === 0) {
      return null
    }

    let bestActionId: string | null = null
    let bestSimilarity = -1

    for (const action of actionsOfType) {
      if (action.features.length !== features.length) {
        continue
      }

      const similarity = this.calculateCosineSimilarity(action.features, features)

      if (similarity > bestSimilarity && similarity > 0.9) {
        bestSimilarity = similarity
        bestActionId = action.id
      }
    }

    return bestActionId
  }

  // Calculate cosine similarity between two vectors
  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same length")
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // Update Q-value
  private updateQValue(stateId: string, actionId: string, reward: number, nextStateId?: string): void {
    const qValueKey = `${stateId}_${actionId}`

    // Get current Q-value
    let qValue = this.qValues.get(qValueKey)

    if (!qValue) {
      qValue = {
        stateId,
        actionId,
        value: 0,
        updateCount: 0,
      }
    }

    // Calculate max Q-value for next state
    let maxNextQValue = 0

    if (nextStateId) {
      const nextStateQValues = Array.from(this.qValues.values()).filter((q) => q.stateId === nextStateId)

      if (nextStateQValues.length > 0) {
        maxNextQValue = Math.max(...nextStateQValues.map((q) => q.value))
      }
    }

    // Update Q-value using Q-learning formula
    // Q(s,a) = Q(s,a) + α * (r + γ * max(Q(s',a')) - Q(s,a))
    qValue.value = qValue.value + this.learningRate * (reward + this.discountFactor * maxNextQValue - qValue.value)

    qValue.updateCount += 1

    this.qValues.set(qValueKey, qValue)
  }

  // Add basic actions
  private addBasicActions(): void {
    // Response generation actions
    this.addAction("response_generation", [0.2, 0.2, 0.2, 0.2, 0.2], "Concise response")
    this.addAction("response_generation", [0.8, 0.5, 0.5, 0.5, 0.5], "Detailed response")
    this.addAction("response_generation", [0.5, 0.8, 0.2, 0.8, 0.5], "Technical response")
    this.addAction("response_generation", [0.5, 0.2, 0.2, 0.2, 0.8], "Simple response")
    this.addAction("response_generation", [0.5, 0.5, 0.8, 0.5, 0.5], "Formal response")
    this.addAction("response_generation", [0.5, 0.5, 0.2, 0.5, 0.5], "Casual response")

    // Question asking actions
    this.addAction("question_asking", [0.5, 0.5, 0.5, 0.5, 0.5], "Ask clarifying question")
    this.addAction("question_asking", [0.5, 0.5, 0.5, 0.5, 0.5], "Ask follow-up question")

    // Topic selection actions
    this.addAction("topic_selection", [0.5, 0.5, 0.5, 0.5, 0.5], "Stay on current topic")
    this.addAction("topic_selection", [0.5, 0.5, 0.5, 0.5, 0.5], "Suggest related topic")

    // Style selection actions
    this.addAction("style_selection", [0.5, 0.5, 0.5, 0.5, 0.5], "Informative style")
    this.addAction("style_selection", [0.5, 0.5, 0.5, 0.5, 0.5], "Conversational style")
    this.addAction("style_selection", [0.5, 0.5, 0.5, 0.5, 0.5], "Empathetic style")
  }

  // Generate a unique ID
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  // Save data to local storage
  private saveToStorage(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(
        "reinforcement_learner_data",
        JSON.stringify({
          states: Array.from(this.states.entries()),
          actions: Array.from(this.actions.entries()),
          episodes: this.episodes,
          qValues: Array.from(this.qValues.entries()),
          learningRate: this.learningRate,
          discountFactor: this.discountFactor,
          explorationRate: this.explorationRate,
          totalReward: this.totalReward,
        }),
      )
    } catch (error) {
      console.error("Failed to save reinforcement learner data:", error)
    }
  }

  // Load data from local storage
  private loadFromStorage(): void {
    if (typeof window === "undefined") return

    try {
      const data = localStorage.getItem("reinforcement_learner_data")
      if (!data) return

      const parsed = JSON.parse(data)

      this.states = new Map(parsed.states)
      this.actions = new Map(parsed.actions)
      this.episodes = parsed.episodes
      this.qValues = new Map(parsed.qValues)
      this.learningRate = parsed.learningRate
      this.discountFactor = parsed.discountFactor
      this.explorationRate = parsed.explorationRate
      this.totalReward = parsed.totalReward
    } catch (error) {
      console.error("Failed to load reinforcement learner data:", error)
    }
  }

  // Convert to JSON
  public toJSON(): string {
    return JSON.stringify({
      states: Array.from(this.states.entries()),
      actions: Array.from(this.actions.entries()),
      episodes: this.episodes,
      qValues: Array.from(this.qValues.entries()),
      learningRate: this.learningRate,
      discountFactor: this.discountFactor,
      explorationRate: this.explorationRate,
      totalReward: this.totalReward,
    })
  }

  // Load from JSON
  public fromJSON(json: string): void {
    try {
      const data = JSON.parse(json)

      this.states = new Map(data.states)
      this.actions = new Map(data.actions)
      this.episodes = data.episodes
      this.qValues = new Map(data.qValues)
      this.learningRate = data.learningRate
      this.discountFactor = data.discountFactor
      this.explorationRate = data.explorationRate
      this.totalReward = data.totalReward
    } catch (error) {
      console.error("Failed to parse reinforcement learner JSON:", error)
    }
  }
}
