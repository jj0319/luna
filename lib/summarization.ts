/**
 * Text Summarization System
 *
 * 긴 텍스트를 요약하는 기능을 제공합니다.
 */

export interface SummarizationOptions {
  maxLength?: number
  minLength?: number
  format?: "paragraph" | "bullets"
  language?: string
}

export interface SummarizationResult {
  originalText: string
  summary: string
  originalLength: number
  summaryLength: number
  compressionRatio: number
}

export class TextSummarizer {
  private cache: Map<string, SummarizationResult> = new Map()

  constructor() {
    this.loadCache()
  }

  /**
   * 텍스트 요약
   */
  public async summarize(text: string, options: SummarizationOptions = {}): Promise<SummarizationResult> {
    if (!text.trim()) {
      throw new Error("요약할 텍스트가 비어있습니다.")
    }

    // 기본 옵션 설정
    const maxLength = options.maxLength || 150
    const minLength = options.minLength || 50
    const format = options.format || "paragraph"
    const language = options.language || "ko"

    // 캐시 키 생성
    const cacheKey = this.createCacheKey(text, options)

    // 캐시에 있으면 반환
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      // 실제 요약 로직 (여기서는 간단한 구현)
      const summary = this.extractiveSummarize(text, maxLength, minLength, format, language)

      const result: SummarizationResult = {
        originalText: text,
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
        compressionRatio: summary.length / text.length,
      }

      // 캐시에 저장
      this.cache.set(cacheKey, result)
      this.saveCache()

      return result
    } catch (error) {
      console.error("Summarization error:", error)
      throw error
    }
  }

  /**
   * 추출적 요약 구현 (간단한 구현)
   */
  private extractiveSummarize(
    text: string,
    maxLength: number,
    minLength: number,
    format: "paragraph" | "bullets",
    language: string,
  ): string {
    // 문장 분리
    const sentences = this.splitIntoSentences(text, language)

    if (sentences.length <= 3) {
      return text // 문장이 적으면 그대로 반환
    }

    // 각 문장의 중요도 계산
    const sentenceScores = this.scoreSentences(sentences)

    // 중요도 순으로 정렬
    const rankedSentences = sentences
      .map((sentence, index) => ({ sentence, score: sentenceScores[index] }))
      .sort((a, b) => b.score - a.score)

    // 요약 길이 결정
    const targetLength = Math.min(
      Math.max(minLength, Math.floor(text.length * 0.3)), // 원본의 30% 또는 최소 길이
      maxLength, // 최대 길이
    )

    // 중요한 문장 선택
    let summaryText = ""
    let currentLength = 0

    // 원래 순서대로 정렬하기 위한 인덱스 맵
    const originalIndexes = new Map<string, number>()
    sentences.forEach((sentence, index) => {
      originalIndexes.set(sentence, index)
    })

    // 중요도 순으로 문장 선택하되, 길이 제한 준수
    const selectedSentences = []

    for (const { sentence } of rankedSentences) {
      if (currentLength + sentence.length <= targetLength) {
        selectedSentences.push(sentence)
        currentLength += sentence.length
      }

      if (currentLength >= targetLength) break
    }

    // 원래 순서대로 정렬
    selectedSentences.sort((a, b) => {
      const indexA = originalIndexes.get(a) || 0
      const indexB = originalIndexes.get(b) || 0
      return indexA - indexB
    })

    // 형식에 맞게 출력
    if (format === "bullets") {
      summaryText = selectedSentences.map((s) => `• ${s}`).join("\n")
    } else {
      summaryText = selectedSentences.join(" ")
    }

    return summaryText
  }

  /**
   * 문장 분리
   */
  private splitIntoSentences(text: string, language: string): string[] {
    // 언어별 문장 분리 패턴
    let pattern

    if (language === "ko") {
      // 한국어 문장 분리 (마침표, 물음표, 느낌표 뒤에 공백이 오는 경우)
      pattern = /[.!?][^.!?]*(?=[.!?\s]|$)/g
    } else {
      // 영어 및 기타 언어 (마침표, 물음표, 느낌표 뒤에 공백이 오는 경우)
      pattern = /[.!?](?:\s|$)/g
    }

    // 문장 분리
    const sentences = []
    let match
    let lastIndex = 0

    while ((match = pattern.exec(text)) !== null) {
      const sentence = text.substring(lastIndex, match.index + 1).trim()
      if (sentence) sentences.push(sentence)
      lastIndex = match.index + 1
    }

    // 마지막 문장 처리
    if (lastIndex < text.length) {
      const lastSentence = text.substring(lastIndex).trim()
      if (lastSentence) sentences.push(lastSentence)
    }

    return sentences
  }

  /**
   * 문장 중요도 계산
   */
  private scoreSentences(sentences: string[]): number[] {
    // 단어 빈도 계산
    const wordFrequency = new Map<string, number>()

    sentences.forEach((sentence) => {
      const words = sentence.toLowerCase().split(/\s+/)
      words.forEach((word) => {
        if (word.length > 1) {
          // 짧은 단어 무시
          wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1)
        }
      })
    })

    // 각 문장의 점수 계산
    return sentences.map((sentence) => {
      const words = sentence.toLowerCase().split(/\s+/)
      let score = 0

      words.forEach((word) => {
        if (word.length > 1) {
          score += wordFrequency.get(word) || 0
        }
      })

      // 문장 길이로 정규화
      return words.length > 0 ? score / words.length : 0
    })
  }

  /**
   * 캐시 키 생성
   */
  private createCacheKey(text: string, options: SummarizationOptions): string {
    const maxLength = options.maxLength || 150
    const minLength = options.minLength || 50
    const format = options.format || "paragraph"
    const language = options.language || "ko"

    // 텍스트가 너무 길면 해시 사용
    const textKey = text.length > 100 ? this.simpleHash(text) : text

    return `${textKey}:${maxLength}:${minLength}:${format}:${language}`
  }

  /**
   * 간단한 해시 함수
   */
  private simpleHash(text: string): string {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 32비트 정수로 변환
    }
    return hash.toString(16)
  }

  /**
   * 캐시 로드
   */
  private loadCache(): void {
    if (typeof window === "undefined") return

    try {
      const savedCache = localStorage.getItem("summarization_cache")
      if (savedCache) {
        const parsed = JSON.parse(savedCache)
        this.cache = new Map(parsed)
      }
    } catch (error) {
      console.error("Failed to load summarization cache:", error)
    }
  }

  /**
   * 캐시 저장
   */
  private saveCache(): void {
    if (typeof window === "undefined") return

    try {
      const cacheArray = Array.from(this.cache.entries())
      localStorage.setItem("summarization_cache", JSON.stringify(cacheArray))
    } catch (error) {
      console.error("Failed to save summarization cache:", error)
    }
  }

  /**
   * 캐시 초기화
   */
  public clearCache(): void {
    this.cache.clear()
    this.saveCache()
  }
}

// 싱글톤 인스턴스 생성
export const textSummarizer = new TextSummarizer()
