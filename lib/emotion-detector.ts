/**
 * 감정 감지기
 *
 * 텍스트에서 감정을 분석하고 감지하는 모듈
 */

// 감정 분석 결과 인터페이스
export interface EmotionAnalysis {
  dominant: string
  emotions: Record<string, number>
  confidence: number
  intensity: number
  sentiment: "positive" | "negative" | "neutral"
  language: string
}

export class EmotionDetector {
  private initialized = false
  private emotionKeywords: Record<string, string[]> = {}
  private sentimentKeywords: Record<string, string[]> = {}
  private intensityModifiers: string[] = []
  private languageDetectors: Record<string, RegExp[]> = {}

  constructor() {
    // 초기화 시 감정 키워드 및 언어 감지기 설정
  }

  /**
   * 감정 감지기 초기화
   */
  async initialize(): Promise<void> {
    try {
      // 감정 키워드 설정
      this.emotionKeywords = {
        joy: [
          "행복",
          "기쁨",
          "즐거움",
          "신남",
          "좋음",
          "웃음",
          "미소",
          "환희",
          "만족",
          "행운",
          "happy",
          "joy",
          "delighted",
          "pleased",
          "glad",
          "cheerful",
          "content",
          "satisfied",
          "thrilled",
          "elated",
        ],
        sadness: [
          "슬픔",
          "우울",
          "비통",
          "눈물",
          "아픔",
          "상처",
          "실망",
          "좌절",
          "그리움",
          "외로움",
          "sad",
          "unhappy",
          "depressed",
          "gloomy",
          "miserable",
          "heartbroken",
          "disappointed",
          "upset",
          "down",
          "blue",
        ],
        anger: [
          "화남",
          "분노",
          "격분",
          "짜증",
          "격노",
          "불만",
          "억울",
          "증오",
          "적대",
          "혐오",
          "angry",
          "mad",
          "furious",
          "enraged",
          "irritated",
          "annoyed",
          "frustrated",
          "outraged",
          "hostile",
          "bitter",
        ],
        fear: [
          "두려움",
          "공포",
          "불안",
          "걱정",
          "겁",
          "무서움",
          "긴장",
          "조심",
          "경계",
          "위험",
          "afraid",
          "scared",
          "frightened",
          "terrified",
          "anxious",
          "worried",
          "nervous",
          "uneasy",
          "alarmed",
          "panicked",
        ],
        surprise: [
          "놀람",
          "충격",
          "경악",
          "예상치 못한",
          "갑작스러운",
          "깜짝",
          "예기치 않은",
          "의외",
          "기대 이상",
          "예상 밖",
          "surprised",
          "shocked",
          "astonished",
          "amazed",
          "startled",
          "stunned",
          "unexpected",
          "sudden",
          "wow",
          "whoa",
        ],
        disgust: [
          "역겨움",
          "구역질",
          "메스꺼움",
          "불쾌",
          "혐오",
          "싫음",
          "거부감",
          "불결",
          "더러움",
          "비위",
          "disgusted",
          "revolted",
          "repulsed",
          "nauseated",
          "sickened",
          "grossed out",
          "appalled",
          "repelled",
          "aversion",
          "distaste",
        ],
        trust: [
          "신뢰",
          "믿음",
          "확신",
          "의지",
          "안심",
          "안전",
          "보호",
          "확실",
          "진실",
          "충성",
          "trust",
          "believe",
          "faith",
          "confidence",
          "reliance",
          "assurance",
          "certainty",
          "dependence",
          "conviction",
          "loyalty",
        ],
        anticipation: [
          "기대",
          "예상",
          "희망",
          "전망",
          "계획",
          "준비",
          "예측",
          "예견",
          "기다림",
          "설렘",
          "anticipate",
          "expect",
          "hope",
          "look forward",
          "await",
          "foresee",
          "predict",
          "forecast",
          "prospect",
          "excitement",
        ],
        love: [
          "사랑",
          "애정",
          "연인",
          "좋아함",
          "애착",
          "그리움",
          "연모",
          "친밀",
          "다정",
          "애틋",
          "love",
          "adore",
          "affection",
          "fondness",
          "attachment",
          "devotion",
          "passion",
          "tenderness",
          "warmth",
          "cherish",
        ],
        confusion: [
          "혼란",
          "당황",
          "어리둥절",
          "난감",
          "복잡",
          "이해불가",
          "미궁",
          "미로",
          "곤혹",
          "난처",
          "confused",
          "puzzled",
          "perplexed",
          "bewildered",
          "baffled",
          "disoriented",
          "muddled",
          "uncertain",
          "unclear",
          "lost",
        ],
      }

      // 감정 강도 수정자 설정
      this.intensityModifiers = [
        "매우",
        "정말",
        "너무",
        "굉장히",
        "엄청",
        "완전히",
        "극도로",
        "아주",
        "가장",
        "절대적으로",
        "very",
        "really",
        "extremely",
        "incredibly",
        "absolutely",
        "completely",
        "totally",
        "utterly",
        "highly",
        "intensely",
      ]

      // 감정 극성 키워드 설정
      this.sentimentKeywords = {
        positive: [
          "좋은",
          "훌륭한",
          "멋진",
          "아름다운",
          "행복한",
          "즐거운",
          "기쁜",
          "만족스러운",
          "성공적인",
          "긍정적인",
          "good",
          "great",
          "excellent",
          "wonderful",
          "amazing",
          "fantastic",
          "terrific",
          "awesome",
          "positive",
          "nice",
        ],
        negative: [
          "나쁜",
          "끔찍한",
          "형편없는",
          "실망스러운",
          "불쾌한",
          "불만족스러운",
          "실패한",
          "부정적인",
          "최악의",
          "괴로운",
          "bad",
          "terrible",
          "awful",
          "horrible",
          "disappointing",
          "unpleasant",
          "poor",
          "negative",
          "worst",
          "dreadful",
        ],
      }

      // 언어 감지기 설정
      this.languageDetectors = {
        korean: [/[가-힣]+/],
        english: [/[a-zA-Z]+/],
        japanese: [/[\u3040-\u309F\u30A0-\u30FF]+/],
        chinese: [/[\u4E00-\u9FFF]+/],
      }

      this.initialized = true
    } catch (error) {
      console.error("감정 감지기 초기화 오류:", error)
      throw error
    }
  }

  /**
   * 텍스트에서 감정 감지
   */
  async detectEmotion(text: string): Promise<EmotionAnalysis> {
    if (!this.initialized) {
      throw new Error("감정 감지기가 초기화되지 않았습니다.")
    }

    try {
      // 텍스트 전처리
      const processedText = this.preprocessText(text)

      // 언어 감지
      const language = this.detectLanguage(processedText)

      // 감정 점수 계산
      const emotionScores = this.calculateEmotionScores(processedText)

      // 지배적 감정 결정
      const dominantEmotion = this.determineDominantEmotion(emotionScores)

      // 감정 강도 계산
      const intensity = this.calculateIntensity(processedText, emotionScores)

      // 감정 극성 결정
      const sentiment = this.determineSentiment(emotionScores)

      // 신뢰도 계산
      const confidence = this.calculateConfidence(emotionScores, processedText)

      return {
        dominant: dominantEmotion,
        emotions: emotionScores,
        confidence,
        intensity,
        sentiment,
        language,
      }
    } catch (error) {
      console.error("감정 감지 오류:", error)
      return {
        dominant: "neutral",
        emotions: { neutral: 1.0 },
        confidence: 0.5,
        intensity: 0.5,
        sentiment: "neutral",
        language: "unknown",
      }
    }
  }

  /**
   * 텍스트 전처리
   */
  private preprocessText(text: string): string {
    // 소문자 변환
    let processedText = text.toLowerCase()

    // 특수 문자 제거 (단, 감정 표현에 중요한 일부 기호는 유지)
    processedText = processedText.replace(/[^\w\s!?.,;:'"()]/g, " ")

    // 연속된 공백 제거
    processedText = processedText.replace(/\s+/g, " ").trim()

    return processedText
  }

  /**
   * 언어 감지
   */
  private detectLanguage(text: string): string {
    for (const [language, patterns] of Object.entries(this.languageDetectors)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return language
        }
      }
    }
    return "unknown"
  }

  /**
   * 감정 점수 계산
   */
  private calculateEmotionScores(text: string): Record<string, number> {
    const scores: Record<string, number> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
      trust: 0,
      anticipation: 0,
      love: 0,
      confusion: 0,
      neutral: 0.1, // 기본값
    }

    // 각 감정 키워드 검색
    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          scores[emotion] += 0.2

          // 강도 수정자가 함께 있는지 확인
          for (const modifier of this.intensityModifiers) {
            const pattern = new RegExp(`${modifier}\\s+${keyword}|${keyword}\\s+${modifier}`)
            if (pattern.test(text)) {
              scores[emotion] += 0.3
              break
            }
          }
        }
      }
    }

    // 감정 점수 정규화
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    if (total > 0) {
      for (const emotion in scores) {
        scores[emotion] = scores[emotion] / total
      }
    }

    return scores
  }

  /**
   * 지배적 감정 결정
   */
  private determineDominantEmotion(scores: Record<string, number>): string {
    let dominant = "neutral"
    let maxScore = 0

    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score
        dominant = emotion
      }
    }

    // 임계값 이하면 중립으로 판단
    if (maxScore < 0.2) {
      return "neutral"
    }

    return dominant
  }

  /**
   * 감정 강도 계산
   */
  private calculateIntensity(text: string, scores: Record<string, number>): number {
    // 기본 강도는 최대 감정 점수
    let intensity = Math.max(...Object.values(scores))

    // 강도 수정자 존재 여부에 따라 조정
    for (const modifier of this.intensityModifiers) {
      if (text.includes(modifier)) {
        intensity = Math.min(1.0, intensity * 1.5)
        break
      }
    }

    // 느낌표, 대문자 등에 따라 조정
    const exclamationCount = (text.match(/!/g) || []).length
    intensity = Math.min(1.0, intensity + exclamationCount * 0.1)

    return intensity
  }

  /**
   * 감정 극성 결정
   */
  private determineSentiment(scores: Record<string, number>): "positive" | "negative" | "neutral" {
    // 긍정적 감정 점수 합산
    const positiveScore = scores.joy + scores.trust + scores.anticipation + scores.love

    // 부정적 감정 점수 합산
    const negativeScore = scores.sadness + scores.anger + scores.fear + scores.disgust

    // 임계값 설정
    const threshold = 0.1

    if (positiveScore - negativeScore > threshold) {
      return "positive"
    } else if (negativeScore - positiveScore > threshold) {
      return "negative"
    } else {
      return "neutral"
    }
  }

  /**
   * 신뢰도 계산
   */
  private calculateConfidence(scores: Record<string, number>, text: string): number {
    // 기본 신뢰도
    let confidence = 0.5

    // 최대 점수가 높을수록 신뢰도 증가
    const maxScore = Math.max(...Object.values(scores))
    confidence += maxScore * 0.3

    // 텍스트 길이에 따른 신뢰도 조정 (너무 짧으면 신뢰도 감소)
    const lengthFactor = Math.min(text.length / 50, 1) * 0.2
    confidence += lengthFactor

    // 신뢰도 범위 제한
    return Math.min(1.0, Math.max(0.1, confidence))
  }

  /**
   * 감정 감지기가 초기화되었는지 확인
   */
  isInitialized(): boolean {
    return this.initialized
  }
}
