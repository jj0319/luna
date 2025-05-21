/**
 * Speech Recognition System
 *
 * 음성을 텍스트로 변환하는 기능을 제공합니다.
 */

// 브라우저의 SpeechRecognition API를 사용
const SpeechRecognition =
  typeof window !== "undefined" ? window.SpeechRecognition || (window as any).webkitSpeechRecognition : null

export interface SpeechRecognitionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}

export interface SpeechRecognitionResult {
  text: string
  isFinal: boolean
  confidence: number
}

export class SpeechRecognizer {
  private recognition: any
  private isListening = false
  private language = "ko-KR"
  private onResultCallback: ((result: SpeechRecognitionResult) => void) | null = null
  private onErrorCallback: ((error: any) => void) | null = null
  private onEndCallback: (() => void) | null = null

  constructor() {
    if (typeof window !== "undefined" && SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = this.language
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 1

      this.recognition.onresult = this.handleResult.bind(this)
      this.recognition.onerror = this.handleError.bind(this)
      this.recognition.onend = this.handleEnd.bind(this)
    }
  }

  /**
   * 음성 인식이 지원되는지 확인
   */
  public isSupported(): boolean {
    return !!SpeechRecognition
  }

  /**
   * 음성 인식 시작
   */
  public start(options: SpeechRecognitionOptions = {}): boolean {
    if (!this.isSupported()) {
      console.error("Speech recognition is not supported in this browser")
      return false
    }

    if (this.isListening) {
      this.stop()
    }

    // 옵션 적용
    if (options.language) {
      this.recognition.lang = options.language
    }
    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous
    }
    if (options.interimResults !== undefined) {
      this.recognition.interimResults = options.interimResults
    }
    if (options.maxAlternatives) {
      this.recognition.maxAlternatives = options.maxAlternatives
    }

    try {
      this.recognition.start()
      this.isListening = true
      return true
    } catch (error) {
      console.error("Failed to start speech recognition:", error)
      return false
    }
  }

  /**
   * 음성 인식 중지
   */
  public stop(): void {
    if (this.isListening && this.recognition) {
      try {
        this.recognition.stop()
        this.isListening = false
      } catch (error) {
        console.error("Failed to stop speech recognition:", error)
      }
    }
  }

  /**
   * 결과 콜백 설정
   */
  public onResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.onResultCallback = callback
  }

  /**
   * 에러 콜백 설정
   */
  public onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback
  }

  /**
   * 종료 콜백 설정
   */
  public onEnd(callback: () => void): void {
    this.onEndCallback = callback
  }

  /**
   * 현재 듣고 있는지 여부
   */
  public isRecording(): boolean {
    return this.isListening
  }

  /**
   * 언어 설정
   */
  public setLanguage(language: string): void {
    this.language = language
    if (this.recognition) {
      this.recognition.lang = language
    }
  }

  /**
   * 결과 처리 핸들러
   */
  private handleResult(event: any): void {
    if (!event.results) return

    const result = event.results[event.resultIndex]
    if (!result) return

    const transcript = result[0].transcript
    const confidence = result[0].confidence
    const isFinal = result.isFinal

    if (this.onResultCallback) {
      this.onResultCallback({
        text: transcript,
        isFinal,
        confidence,
      })
    }
  }

  /**
   * 에러 처리 핸들러
   */
  private handleError(event: any): void {
    this.isListening = false
    if (this.onErrorCallback) {
      this.onErrorCallback(event)
    }
  }

  /**
   * 종료 처리 핸들러
   */
  private handleEnd(): void {
    this.isListening = false
    if (this.onEndCallback) {
      this.onEndCallback()
    }
  }
}

// 싱글톤 인스턴스 생성
export const speechRecognizer = typeof window !== "undefined" ? new SpeechRecognizer() : null
