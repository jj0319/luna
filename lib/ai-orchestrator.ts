/**
 * AI 오케스트레이터
 *
 * 다양한 AI 모듈 간의 조정과 통합을 담당하는 시스템
 */

import { oracleSystem, type ProcessResult, type Context } from "./oracle-core"

// 처리 전략 인터페이스
interface ProcessingStrategy {
  name: string
  description: string
  condition: (input: string, context: Context) => boolean
  process: (input: string, context: Context) => Promise<ProcessResult>
  priority: number
}

// 모듈 조합 인터페이스
interface ModuleCombination {
  name: string
  modules: string[]
  weights: Record<string, number>
  description: string
}

/**
 * AI 오케스트레이터 클래스
 * 다양한 AI 모듈의 조합과 처리 전략을 관리
 */
export class AIOrchestrator {
  private strategies: ProcessingStrategy[] = []
  private combinations: ModuleCombination[] = []
  private activeStrategy: string | null = null
  private activeCombination: string | null = null

  constructor() {
    this.initializeStrategies()
    this.initializeCombinations()

    // 기본 전략 및 조합 설정
    this.activeStrategy = "balanced"
    this.activeCombination = "standard"
  }

  /**
   * 처리 전략 초기화
   */
  private initializeStrategies(): void {
    this.strategies = [
      {
        name: "balanced",
        description: "모든 모듈의 균형 잡힌 활용",
        condition: () => true, // 기본 전략
        process: async (input, context) => {
          return await oracleSystem.processInput(input, context)
        },
        priority: 0,
      },
      {
        name: "knowledge_focused",
        description: "지식 기반 응답에 중점",
        condition: (input) => {
          const knowledgePatterns = [
            /what is|what are|how does|how do|explain|define|describe|tell me about|information on/i,
          ]
          return knowledgePatterns.some((pattern) => pattern.test(input))
        },
        process: async (input, context) => {
          // 지식 그래프 가중치 증가
          const originalWeights = { ...oracleSystem.getModuleStatus("weights") }
          oracleSystem.updateModuleWeights({
            knowledgeGraph: 0.4,
            reasoningEngine: 0.3,
            memorySystem: 0.1,
            personalizationEngine: 0.1,
            emotionDetector: 0.05,
            multiModalProcessor: 0.05,
          })

          const result = await oracleSystem.processInput(input, context)

          // 원래 가중치 복원
          oracleSystem.updateModuleWeights(originalWeights)

          return result
        },
        priority: 1,
      },
      {
        name: "emotional_support",
        description: "감정적 지원과 공감에 중점",
        condition: (input) => {
          const emotionalPatterns = [
            /feel|feeling|sad|happy|angry|upset|worried|anxious|stressed|depressed|excited|overwhelmed/i,
            /help me|support|comfort|understand|listen|care|empathy|sympathy/i,
          ]
          return emotionalPatterns.some((pattern) => pattern.test(input))
        },
        process: async (input, context) => {
          // 감정 감지 및 개인화 가중치 증가
          const originalWeights = { ...oracleSystem.getModuleStatus("weights") }
          oracleSystem.updateModuleWeights({
            emotionDetector: 0.4,
            personalizationEngine: 0.3,
            reasoningEngine: 0.15,
            memorySystem: 0.1,
            knowledgeGraph: 0.05,
            multiModalProcessor: 0,
          })

          const result = await oracleSystem.processInput(input, context)

          // 원래 가중치 복원
          oracleSystem.updateModuleWeights(originalWeights)

          return result
        },
        priority: 2,
      },
      {
        name: "problem_solving",
        description: "문제 해결과 추론에 중점",
        condition: (input) => {
          const problemPatterns = [
            /solve|solution|problem|issue|challenge|how to|best way|approach|strategy|method/i,
            /analyze|evaluate|compare|contrast|pros and cons|advantages|disadvantages/i,
          ]
          return problemPatterns.some((pattern) => pattern.test(input))
        },
        process: async (input, context) => {
          // 추론 엔진 가중치 증가
          const originalWeights = { ...oracleSystem.getModuleStatus("weights") }
          oracleSystem.updateModuleWeights({
            reasoningEngine: 0.5,
            knowledgeGraph: 0.2,
            memorySystem: 0.15,
            personalizationEngine: 0.1,
            emotionDetector: 0.05,
            multiModalProcessor: 0,
          })

          const result = await oracleSystem.processInput(input, context)

          // 원래 가중치 복원
          oracleSystem.updateModuleWeights(originalWeights)

          return result
        },
        priority: 1,
      },
      {
        name: "personalized_response",
        description: "사용자 맞춤형 응답에 중점",
        condition: (input, context) => {
          // 사용자 ID가 있고 이전 상호작용이 충분히 있는 경우
          return !!context.userId && (context.previousInteractions?.length || 0) > 3
        },
        process: async (input, context) => {
          // 개인화 및 메모리 가중치 증가
          const originalWeights = { ...oracleSystem.getModuleStatus("weights") }
          oracleSystem.updateModuleWeights({
            personalizationEngine: 0.4,
            memorySystem: 0.3,
            reasoningEngine: 0.15,
            knowledgeGraph: 0.1,
            emotionDetector: 0.05,
            multiModalProcessor: 0,
          })

          const result = await oracleSystem.processInput(input, context)

          // 원래 가중치 복원
          oracleSystem.updateModuleWeights(originalWeights)

          return result
        },
        priority: 1,
      },
    ]
  }

  /**
   * 모듈 조합 초기화
   */
  private initializeCombinations(): void {
    this.combinations = [
      {
        name: "standard",
        modules: ["knowledgeGraph", "memorySystem", "reasoningEngine", "personalizationEngine", "emotionDetector"],
        weights: {
          knowledgeGraph: 0.2,
          memorySystem: 0.15,
          reasoningEngine: 0.25,
          personalizationEngine: 0.15,
          emotionDetector: 0.1,
          multiModalProcessor: 0.15,
        },
        description: "모든 모듈의 균형 잡힌 조합",
      },
      {
        name: "knowledge_heavy",
        modules: ["knowledgeGraph", "reasoningEngine", "memorySystem"],
        weights: {
          knowledgeGraph: 0.5,
          reasoningEngine: 0.3,
          memorySystem: 0.2,
          personalizationEngine: 0,
          emotionDetector: 0,
          multiModalProcessor: 0,
        },
        description: "지식과 추론에 중점을 둔 조합",
      },
      {
        name: "emotional_intelligence",
        modules: ["emotionDetector", "personalizationEngine", "memorySystem"],
        weights: {
          emotionDetector: 0.5,
          personalizationEngine: 0.3,
          memorySystem: 0.2,
          knowledgeGraph: 0,
          reasoningEngine: 0,
          multiModalProcessor: 0,
        },
        description: "감정 인식과 개인화에 중점을 둔 조합",
      },
      {
        name: "multimodal_focus",
        modules: ["multiModalProcessor", "knowledgeGraph", "reasoningEngine"],
        weights: {
          multiModalProcessor: 0.6,
          knowledgeGraph: 0.2,
          reasoningEngine: 0.2,
          memorySystem: 0,
          personalizationEngine: 0,
          emotionDetector: 0,
        },
        description: "멀티모달 처리에 중점을 둔 조합",
      },
    ]
  }

  /**
   * 입력 처리
   */
  async processInput(input: string, context: Context): Promise<ProcessResult> {
    // 적절한 전략 선택
    const strategy = this.selectStrategy(input, context)
    this.activeStrategy = strategy.name

    // 선택된 전략으로 처리
    return await strategy.process(input, context)
  }

  /**
   * 입력에 적합한 전략 선택
   */
  private selectStrategy(input: string, context: Context): ProcessingStrategy {
    // 조건에 맞는 전략들 필터링
    const matchingStrategies = this.strategies.filter((strategy) => strategy.condition(input, context))

    // 우선순위가 가장 높은 전략 선택
    if (matchingStrategies.length > 0) {
      return matchingStrategies.sort((a, b) => b.priority - a.priority)[0]
    }

    // 기본 전략 반환
    return this.strategies.find((s) => s.name === "balanced")!
  }

  /**
   * 모듈 조합 변경
   */
  changeCombination(combinationName: string): boolean {
    const combination = this.combinations.find((c) => c.name === combinationName)
    if (!combination) {
      return false
    }

    this.activeCombination = combinationName
    oracleSystem.updateModuleWeights(combination.weights)
    return true
  }

  /**
   * 현재 활성 전략 가져오기
   */
  getActiveStrategy(): string {
    return this.activeStrategy || "balanced"
  }

  /**
   * 현재 활성 조합 가져오기
   */
  getActiveCombination(): string {
    return this.activeCombination || "standard"
  }

  /**
   * 사용 가능한 모든 전략 가져오기
   */
  getAvailableStrategies(): Array<{ name: string; description: string }> {
    return this.strategies.map((s) => ({
      name: s.name,
      description: s.description,
    }))
  }

  /**
   * 사용 가능한 모든 조합 가져오기
   */
  getAvailableCombinations(): Array<{ name: string; description: string }> {
    return this.combinations.map((c) => ({
      name: c.name,
      description: c.description,
    }))
  }
}

// 싱글톤 인스턴스 생성
export const aiOrchestrator = new AIOrchestrator()
