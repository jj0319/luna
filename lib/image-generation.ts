/**
 * Image Generation System
 *
 * 텍스트 프롬프트를 기반으로 이미지를 생성하는 기능을 제공합니다.
 */

export interface ImageGenerationOptions {
  width?: number
  height?: number
  style?: string
  seed?: number
  steps?: number
  guidance?: number
}

export interface GeneratedImage {
  url: string
  prompt: string
  width: number
  height: number
  timestamp: number
}

export class ImageGenerator {
  private apiKey: string | null = null
  private apiEndpoint = "https://api.openai.com/v1/images/generations"
  private history: GeneratedImage[] = []
  private defaultOptions: ImageGenerationOptions = {
    width: 512,
    height: 512,
    style: "vivid",
    steps: 30,
    guidance: 7.5,
  }

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
    this.loadHistory()
  }

  /**
   * API 키 설정
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  /**
   * 이미지 생성
   */
  public async generateImage(prompt: string, options: ImageGenerationOptions = {}): Promise<GeneratedImage | null> {
    // API 키가 없으면 모의 이미지 생성
    if (!this.apiKey) {
      return this.generateMockImage(prompt, options)
    }

    const mergedOptions = { ...this.defaultOptions, ...options }

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: `${mergedOptions.width}x${mergedOptions.height}`,
          style: mergedOptions.style,
          response_format: "url",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || "Image generation failed")
      }

      const data = await response.json()

      if (data.data && data.data.length > 0) {
        const generatedImage: GeneratedImage = {
          url: data.data[0].url,
          prompt,
          width: mergedOptions.width || 512,
          height: mergedOptions.height || 512,
          timestamp: Date.now(),
        }

        // 히스토리에 추가
        this.addToHistory(generatedImage)

        return generatedImage
      }

      return null
    } catch (error) {
      console.error("Image generation error:", error)
      return this.generateMockImage(prompt, options)
    }
  }

  /**
   * 모의 이미지 생성 (API 키가 없을 때 사용)
   */
  private generateMockImage(prompt: string, options: ImageGenerationOptions = {}): GeneratedImage {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const width = mergedOptions.width || 512
    const height = mergedOptions.height || 512

    // 플레이스홀더 이미지 URL 생성
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 100))
    const placeholderUrl = `https://via.placeholder.com/${width}x${height}.png?text=${encodedPrompt}`

    const mockImage: GeneratedImage = {
      url: placeholderUrl,
      prompt,
      width,
      height,
      timestamp: Date.now(),
    }

    // 히스토리에 추가
    this.addToHistory(mockImage)

    return mockImage
  }

  /**
   * 생성된 이미지 히스토리에 추가
   */
  private addToHistory(image: GeneratedImage): void {
    this.history.unshift(image)

    // 최대 20개까지만 저장
    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20)
    }

    this.saveHistory()
  }

  /**
   * 히스토리 로드
   */
  private loadHistory(): void {
    if (typeof window === "undefined") return

    try {
      const savedHistory = localStorage.getItem("image_generation_history")
      if (savedHistory) {
        this.history = JSON.parse(savedHistory)
      }
    } catch (error) {
      console.error("Failed to load image generation history:", error)
    }
  }

  /**
   * 히스토리 저장
   */
  private saveHistory(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("image_generation_history", JSON.stringify(this.history))
    } catch (error) {
      console.error("Failed to save image generation history:", error)
    }
  }

  /**
   * 생성된 이미지 히스토리 가져오기
   */
  public getHistory(): GeneratedImage[] {
    return [...this.history]
  }

  /**
   * 히스토리 초기화
   */
  public clearHistory(): void {
    this.history = []
    this.saveHistory()
  }

  /**
   * 기본 옵션 설정
   */
  public setDefaultOptions(options: ImageGenerationOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }
}

// 싱글톤 인스턴스 생성
export const imageGenerator = new ImageGenerator()
