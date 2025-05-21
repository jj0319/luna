/**
 * Translation System
 *
 * 텍스트 번역 기능을 제공합니다.
 */

export interface TranslationOptions {
  sourceLanguage?: string
  targetLanguage: string
  formalityLevel?: "formal" | "informal"
}

export interface TranslationResult {
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
}

export class Translator {
  private apiKey: string | null = null
  private cache: Map<string, TranslationResult> = new Map()
  private supportedLanguages: Map<string, string> = new Map([
    ["ko", "한국어"],
    ["en", "영어"],
    ["ja", "일본어"],
    ["zh", "중국어"],
    ["es", "스페인어"],
    ["fr", "프랑스어"],
    ["de", "독일어"],
    ["ru", "러시아어"],
    ["it", "이탈리아어"],
    ["pt", "포르투갈어"],
  ])

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
    this.loadCache()
  }

  /**
   * API 키 설정
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  /**
   * 텍스트 번역
   */
  public async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    if (!text.trim()) {
      throw new Error("번역할 텍스트가 비어있습니다.")
    }

    // 캐시 키 생성
    const cacheKey = this.createCacheKey(text, options)

    // 캐시에 있으면 반환
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // API 키가 없으면 모의 번역
    if (!this.apiKey) {
      return this.mockTranslate(text, options)
    }

    try {
      // 실제 API 호출 (여기서는 모의 구현)
      // 실제 구현에서는 선택한 번역 API에 맞게 구현해야 함
      const result = await this.mockTranslate(text, options)

      // 캐시에 저장
      this.cache.set(cacheKey, result)
      this.saveCache()

      return result
    } catch (error) {
      console.error("Translation error:", error)
      throw error
    }
  }

  /**
   * 모의 번역 (API 키가 없을 때 사용)
   */
  private async mockTranslate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    // 간단한 모의 번역 구현
    const sourceLanguage = options.sourceLanguage || "auto"
    const targetLanguage = options.targetLanguage

    // 번역 결과 생성
    let translatedText = text

    // 간단한 번역 시뮬레이션
    if (targetLanguage === "en" && text.match(/[가-힣]/)) {
      // 한국어 -> 영어 시뮬레이션
      translatedText = `[Translated to English]: ${text}`
    } else if (targetLanguage === "ko" && !text.match(/[가-힣]/)) {
      // 영어 -> 한국어 시뮬레이션
      translatedText = `[영어에서 번역됨]: ${text}`
    } else if (targetLanguage === "ja") {
      // 일본어로 번역 시뮬레이션
      translatedText = `[日本語に翻訳]: ${text}`
    } else if (targetLanguage === "zh") {
      // 중국어로 번역 시뮬레이션
      translatedText = `[翻译成中文]: ${text}`
    } else {
      translatedText = `[Translated to ${targetLanguage}]: ${text}`
    }

    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      originalText: text,
      translatedText,
      sourceLanguage: sourceLanguage === "auto" ? this.detectLanguage(text) : sourceLanguage,
      targetLanguage,
      confidence: 0.85,
    }
  }

  /**
   * 언어 감지 (간단한 구현)
   */
  private detectLanguage(text: string): string {
    // 간단한 언어 감지 로직
    if (text.match(/[가-힣]/)) return "ko"
    if (text.match(/[一-龯]/)) return "zh"
    if (text.match(/[ぁ-んァ-ン]/)) return "ja"
    return "en" // 기본값
  }

  /**
   * 캐시 키 생성
   */
  private createCacheKey(text: string, options: TranslationOptions): string {
    const sourceLanguage = options.sourceLanguage || "auto"
    const targetLanguage = options.targetLanguage
    const formality = options.formalityLevel || "formal"

    return `${sourceLanguage}:${targetLanguage}:${formality}:${text}`
  }

  /**
   * 캐시 로드
   */
  private loadCache(): void {
    if (typeof window === "undefined") return

    try {
      const savedCache = localStorage.getItem("translation_cache")
      if (savedCache) {
        const parsed = JSON.parse(savedCache)
        this.cache = new Map(parsed)
      }
    } catch (error) {
      console.error("Failed to load translation cache:", error)
    }
  }

  /**
   * 캐시 저장
   */
  private saveCache(): void {
    if (typeof window === "undefined") return

    try {
      const cacheArray = Array.from(this.cache.entries())
      localStorage.setItem("translation_cache", JSON.stringify(cacheArray))
    } catch (error) {
      console.error("Failed to save translation cache:", error)
    }
  }

  /**
   * 캐시 초기화
   */
  public clearCache(): void {
    this.cache.clear()
    this.saveCache()
  }

  /**
   * 지원하는 언어 목록 가져오기
   */
  public getSupportedLanguages(): Map<string, string> {
    return new Map(this.supportedLanguages)
  }
}

// 싱글톤 인스턴스 생성
export const translator = new Translator()
