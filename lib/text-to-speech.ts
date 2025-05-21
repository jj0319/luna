/**
 * Text-to-Speech System
 *
 * 텍스트를 음성으로 변환하는 기능을 제공합니다.
 */

export interface TTSOptions {
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
  language?: string
}

export interface TTSVoice {
  id: string
  name: string
  language: string
  default: boolean
}

export class TextToSpeech {
  private synthesis: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private defaultVoice: SpeechSynthesisVoice | null = null
  private defaultOptions: TTSOptions = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    language: "ko-KR",
  }
  private isSpeaking = false

  constructor() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      this.synthesis = window.speechSynthesis
      this.loadVoices()

      // 음성 목록이 변경될 때 다시 로드
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = this.loadVoices.bind(this)
      }
    }
  }

  /**
   * TTS가 지원되는지 확인
   */
  public isSupported(): boolean {
    return !!this.synthesis
  }

  /**
   * 사용 가능한 음성 목록 로드
   */
  private loadVoices(): void {
    if (!this.synthesis) return

    this.voices = this.synthesis.getVoices()

    // 기본 한국어 음성 찾기
    this.defaultVoice =
      this.voices.find((voice) => voice.lang.includes("ko") && voice.default) ||
      this.voices.find((voice) => voice.lang.includes("ko")) ||
      null
  }

  /**
   * 사용 가능한 음성 목록 반환
   */
  public getVoices(): TTSVoice[] {
    return this.voices.map((voice) => ({
      id: voice.voiceURI,
      name: voice.name,
      language: voice.lang,
      default: voice.default,
    }))
  }

  /**
   * 텍스트를 음성으로 변환
   */
  public speak(text: string, options: TTSOptions = {}): boolean {
    if (!this.isSupported() || !text) {
      return false
    }

    // 이미 말하고 있다면 중지
    this.stop()

    const utterance = new SpeechSynthesisUtterance(text)

    // 옵션 설정
    const mergedOptions = { ...this.defaultOptions, ...options }

    utterance.rate = mergedOptions.rate || 1.0
    utterance.pitch = mergedOptions.pitch || 1.0
    utterance.volume = mergedOptions.volume || 1.0

    // 음성 설정
    if (options.voice) {
      const selectedVoice = this.voices.find((v) => v.voiceURI === options.voice)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
    } else if (this.defaultVoice) {
      utterance.voice = this.defaultVoice
    }

    // 언어 설정
    if (mergedOptions.language) {
      utterance.lang = mergedOptions.language
    } else if (this.defaultVoice) {
      utterance.lang = this.defaultVoice.lang
    }

    // 이벤트 핸들러
    utterance.onstart = () => {
      this.isSpeaking = true
    }

    utterance.onend = () => {
      this.isSpeaking = false
    }

    utterance.onerror = (event) => {
      console.error("TTS Error:", event)
      this.isSpeaking = false
    }

    // 음성 합성 시작
    this.synthesis!.speak(utterance)
    return true
  }

  /**
   * 음성 합성 중지
   */
  public stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
    }
  }

  /**
   * 음성 합성 일시 중지
   */
  public pause(): void {
    if (this.synthesis) {
      this.synthesis.pause()
    }
  }

  /**
   * 음성 합성 재개
   */
  public resume(): void {
    if (this.synthesis) {
      this.synthesis.resume()
    }
  }

  /**
   * 현재 말하고 있는지 여부
   */
  public isSpeakingNow(): boolean {
    return this.isSpeaking
  }

  /**
   * 기본 옵션 설정
   */
  public setDefaultOptions(options: TTSOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }
}

// 싱글톤 인스턴스 생성
export const textToSpeech = typeof window !== "undefined" ? new TextToSpeech() : null
