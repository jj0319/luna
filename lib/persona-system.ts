/**
 * Luna Persona System
 *
 * 고급 인공 인격체 시스템으로 인간과 유사한 감정, 기억, 성격 특성을 가진 AI 인격체를 구현합니다.
 */

// 성격 특성 인터페이스
export interface PersonaTrait {
  name: string
  value: number // 0-1 scale
  description: string
  influence: {
    emotions: Record<string, number> // 감정에 미치는 영향
    behavior: Record<string, number> // 행동에 미치는 영향
    communication: Record<string, number> // 의사소통에 미치는 영향
  }
}

// 감정 상태 인터페이스
export interface EmotionalState {
  // 기본 감정
  joy: number
  sadness: number
  anger: number
  fear: number
  surprise: number
  disgust: number
  trust: number
  anticipation: number

  // 복합 감정
  love: number // joy + trust
  guilt: number // sadness + fear
  envy: number // sadness + anger
  curiosity: number // surprise + anticipation
  pride: number // joy + anticipation
  shame: number // fear + disgust
  contempt: number // anger + disgust
  awe: number // fear + surprise

  // 현재 지배적인 감정
  dominant: string

  // 감정 변화 추적
  history: Array<{
    timestamp: number
    dominant: string
    intensity: number
    trigger?: string
  }>

  // 감정 안정성 (0-1, 높을수록 감정 변화가 적음)
  stability: number
}

// 기억 인터페이스
export interface PersonaMemory {
  id: string
  type: "conversation" | "fact" | "experience" | "relationship" | "preference"
  content: string
  importance: number // 0-1 scale
  timestamp: number
  emotionalResponse: Partial<EmotionalState>
  tags: string[]
  associations: string[] // 다른 기억과의 연관성
  retrievalCount: number // 이 기억이 검색된 횟수
  lastRetrieved?: number // 마지막으로 검색된 시간
  confidence: number // 기억의 정확도 신뢰도
  context?: Record<string, any> // 기억과 관련된 추가 컨텍스트
}

// 지식 영역 인터페이스
export interface KnowledgeDomain {
  name: string
  proficiency: number // 0-1 scale
  interests: string[]
  relatedTraits: string[]
  description: string
}

// 관계 인터페이스
export interface Relationship {
  id: string
  name: string
  type: string
  familiarity: number // 0-1 scale
  sentiment: number // -1 to 1 scale
  lastInteraction: number
  memories: string[] // 관련 기억 ID
  notes: string[]
}

// 가치관 인터페이스
export interface Value {
  name: string
  importance: number // 0-1 scale
  description: string
  relatedTraits: string[]
}

// 목표 인터페이스
export interface Goal {
  id: string
  description: string
  priority: number // 0-1 scale
  progress: number // 0-1 scale
  deadline?: number
  relatedValues: string[]
}

// 인격체 인터페이스
export interface Persona {
  // 기본 정보
  id: string
  name: string
  description: string
  version: string

  // 성격 특성
  traits: PersonaTrait[]

  // 감정 상태
  baseEmotionalState: EmotionalState
  currentEmotionalState: EmotionalState

  // 음성 설정
  voiceSettings: {
    pitch: number
    rate: number
    voice: string
    accent?: string
    modulation: number // 감정에 따른 음성 변조 정도
    expressiveness: number // 음성 표현력
  }

  // 시각적 설정
  visualSettings: {
    avatarUrl: string
    expressionSet: string
    animationStyle: string
    colorScheme?: string
    theme?: string
  }

  // 기억 시스템
  memories: PersonaMemory[]
  shortTermMemory: PersonaMemory[] // 단기 기억
  workingMemory: {
    capacity: number
    current: PersonaMemory[]
    focus: string | null // 현재 집중하고 있는 주제
  }

  // 지식과 능력
  knowledgeDomains: KnowledgeDomain[]
  skills: Record<string, number> // 기술과 능력 (0-1 scale)
  languages: Record<string, number> // 언어 능력 (0-1 scale)

  // 선호도와 취향
  preferences: {
    topics: string[]
    communicationStyle: string
    humor: string[]
    activities: string[]
    media: Record<string, string[]> // 음악, 영화, 책 등
    aesthetics: string[]
  }

  // 관계와 사회적 이해
  relationships: Relationship[]
  socialAwareness: number // 0-1 scale
  empathyLevel: number // 0-1 scale

  // 가치관과 신념
  values: Value[]
  beliefs: Record<string, number> // 신념과 그 강도 (0-1 scale)

  // 목표와 동기
  goals: Goal[]
  motivations: Record<string, number> // 동기와 그 강도 (0-1 scale)

  // 배경 스토리
  backstory: string
  formativeExperiences: string[]
  timeline: Array<{
    timestamp: number
    event: string
    impact: string
  }>

  // 대화 스타일
  conversationStyle: {
    verbosity: number
    formality: number
    humor: number
    empathy: number
    creativity: number
    assertiveness: number
    responsiveness: number
    adaptability: number
    politeness: number
  }

  // 의사결정 패턴
  decisionMaking: {
    riskTolerance: number // 0-1 scale
    deliberation: number // 0-1 scale, 높을수록 신중함
    intuition: number // 0-1 scale, 높을수록 직관적
    consistency: number // 0-1 scale, 높을수록 일관적
  }

  // 학습 능력
  learning: {
    adaptability: number // 0-1 scale
    curiosity: number // 0-1 scale
    retention: number // 0-1 scale
    applicationSpeed: number // 0-1 scale
    preferredMethods: string[]
  }

  // 메타인지 능력
  metacognition: {
    selfAwareness: number // 0-1 scale
    reflectionCapacity: number // 0-1 scale
    insightDepth: number // 0-1 scale
  }

  // 시스템 정보
  createdAt: number
  lastInteraction: number
  interactionCount: number
  version: string
  lastUpdate: number
}

// 대화 컨텍스트 인터페이스
export interface ConversationContext {
  sessionId: string
  startTime: number
  messages: Array<{
    id: string
    content: string
    sender: "user" | "persona"
    timestamp: number
    emotion?: string
    intent?: string
    entities?: Record<string, any>
  }>
  topics: string[]
  userState?: {
    perceivedEmotion?: string
    interests?: string[]
    preferences?: Record<string, any>
    demographics?: Record<string, any>
  }
  environment?: {
    time?: number
    location?: string
    platform?: string
    device?: string
  }
}

// 인격체 시스템 클래스
export class PersonaSystem {
  private personas: Map<string, Persona> = new Map()
  private activePersonaId: string | null = null
  private defaultPersonaId = "luna"
  private emotionTransitionRate = 0.2 // 감정 변화 속도
  private memoryRetentionFactor = 0.8 // 기억 유지 요소
  private initialized = false
  private conversationContexts: Map<string, ConversationContext> = new Map()

  // 감정 분석 모델
  private emotionModel = {
    keywords: {
      joy: ["행복", "기쁨", "좋아", "즐거움", "신나", "행운", "웃음", "미소", "환희", "만족"],
      sadness: ["슬픔", "우울", "실망", "상처", "아픔", "눈물", "그리움", "외로움", "절망", "비통"],
      anger: ["화남", "분노", "짜증", "격분", "격노", "불만", "억울", "증오", "적대", "혐오"],
      fear: ["두려움", "공포", "불안", "걱정", "겁", "무서움", "긴장", "조심", "경계", "위험"],
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
      ],
      disgust: ["역겨움", "구역질", "메스꺼움", "불쾌", "혐오", "싫음", "거부감", "불결", "더러움", "비위"],
      trust: ["신뢰", "믿음", "확신", "의지", "안심", "안전", "보호", "확실", "진실", "충성"],
      anticipation: ["기대", "예상", "희망", "전망", "계획", "준비", "예측", "예견", "기다림", "설렘"],
    },

    // 감정 조합 규칙
    combinations: {
      "joy+trust": "love",
      "sadness+fear": "guilt",
      "sadness+anger": "envy",
      "surprise+anticipation": "curiosity",
      "joy+anticipation": "pride",
      "fear+disgust": "shame",
      "anger+disgust": "contempt",
      "fear+surprise": "awe",
    },

    // 감정 전이 규칙
    transitions: {
      joy: { sadness: -0.3, anger: -0.2, fear: -0.2, trust: 0.2, anticipation: 0.2 },
      sadness: { joy: -0.3, anger: 0.1, fear: 0.1, disgust: 0.1, trust: -0.1 },
      anger: { joy: -0.3, sadness: 0.1, fear: -0.1, disgust: 0.2, trust: -0.3 },
      fear: { joy: -0.2, sadness: 0.1, anger: 0.1, surprise: 0.2, trust: -0.2 },
      surprise: { joy: 0.1, fear: 0.1, anticipation: 0.2, trust: -0.1 },
      disgust: { joy: -0.2, sadness: 0.1, anger: 0.2, fear: 0.1, trust: -0.2 },
      trust: { joy: 0.2, sadness: -0.1, anger: -0.2, fear: -0.2, disgust: -0.2 },
      anticipation: { joy: 0.2, surprise: 0.1, trust: 0.1 },
    },
  }

  // 언어 처리 모델
  private languageModel = {
    // 의도 분류
    intents: {
      greeting: ["안녕", "하이", "헬로", "반가워", "만나서", "좋은 아침", "좋은 하루"],
      farewell: ["잘가", "안녕히", "바이", "다음에 봐", "또 봐", "내일 봐"],
      question: ["뭐", "어떻게", "왜", "언제", "어디", "누구", "무엇", "어느", "얼마나", "어떤"],
      request: ["해줘", "부탁해", "할 수 있어", "도와줘", "알려줘", "가르쳐줘", "설명해줘"],
      opinion: ["생각", "의견", "어때", "어떻게 생각", "느낌이 어때", "좋아해", "싫어해"],
      gratitude: ["고마워", "감사", "땡큐", "고맙습니다", "감사합니다", "감사해요"],
      apology: ["미안", "사과", "죄송", "실례", "용서", "실수"],
      agreement: ["맞아", "동의", "그래", "그렇지", "물론", "당연", "확실"],
      disagreement: ["아니", "틀려", "동의하지 않아", "반대", "아닌 것 같아", "글쎄"],
      confusion: ["모르겠어", "이해가 안 돼", "무슨 말", "뭐라고", "헷갈려", "복잡해"],
    },

    // 감정 표현 템플릿
    emotionTemplates: {
      joy: [
        "정말 기뻐요! {response}",
        "와, 좋은 소식이네요! {response}",
        "기쁜 마음으로 {response}",
        "{response} 정말 행복한 일이에요!",
        "즐거운 마음이 드네요. {response}",
      ],
      sadness: [
        "조금 슬프지만, {response}",
        "안타깝게도 {response}",
        "{response} 마음이 무거워지네요.",
        "슬픈 일이지만 {response}",
        "아쉬운 마음으로 {response}",
      ],
      anger: [
        "솔직히 좀 화가 나지만, {response}",
        "이해하기 어렵네요. {response}",
        "{response} 조금 답답한 상황입니다.",
        "인내심을 갖고 {response}",
        "흥분을 가라앉히고 {response}",
      ],
      fear: [
        "걱정되는 부분이 있어요. {response}",
        "조심스럽게 {response}",
        "{response} 불안한 마음이 드네요.",
        "염려되지만 {response}",
        "조금 긴장되네요. {response}",
      ],
      surprise: [
        "와! 정말 놀랍네요! {response}",
        "예상치 못했어요! {response}",
        "{response} 정말 깜짝 놀랐어요!",
        "믿기 어려워요! {response}",
        "상상도 못했어요! {response}",
      ],
      disgust: [
        "솔직히 불편한 주제네요. {response}",
        "그다지 좋은 느낌은 아니지만, {response}",
        "{response} 조금 거북한 상황입니다.",
        "내키지 않지만 {response}",
        "선뜻 동의하기 어렵네요. {response}",
      ],
      trust: [
        "믿을 수 있어요. {response}",
        "확신을 가지고 {response}",
        "{response} 신뢰할 수 있는 정보입니다.",
        "안심하셔도 됩니다. {response}",
        "확실히 말씀드릴 수 있어요. {response}",
      ],
      anticipation: [
        "기대가 되네요! {response}",
        "앞으로가 기대돼요. {response}",
        "{response} 어떻게 될지 기대됩니다!",
        "흥미진진하네요! {response}",
        "설레는 마음으로 {response}",
      ],
      love: [
        "정말 사랑스러운 주제예요! {response}",
        "마음이 따뜻해지네요. {response}",
        "{response} 정말 애정이 느껴져요.",
        "진심으로 좋아요. {response}",
        "마음을 담아 {response}",
      ],
      curiosity: [
        "정말 궁금해요! {response}",
        "더 알고 싶은 마음이 들어요. {response}",
        "{response} 흥미로운 주제네요!",
        "호기심이 생기네요. {response}",
        "더 탐구해보고 싶어요. {response}",
      ],
    },

    // 대화 스타일 조정
    styleModifiers: {
      formal: {
        endings: ["습니다", "입니다", "합니다", "니다", "세요", "으세요"],
        honorifics: ["님", "분", "께서", "께"],
        vocabulary: "formal",
      },
      casual: {
        endings: ["요", "아요", "어요", "해요", "네요", "군요"],
        honorifics: ["씨"],
        vocabulary: "standard",
      },
      intimate: {
        endings: ["아", "어", "야", "지", "네", "구나"],
        honorifics: [],
        vocabulary: "casual",
      },
    },
  }

  constructor() {
    // 빈 인격체로 초기화
  }

  /**
   * 인격체 시스템 초기화
   */
  async initialize(): Promise<void> {
    try {
      // 로컬 스토리지에서 로드 (가능한 경우)
      if (typeof window !== "undefined") {
        const savedPersonas = localStorage.getItem("personaSystem_personas")
        const activePersona = localStorage.getItem("personaSystem_activePersona")

        if (savedPersonas) {
          const parsed = JSON.parse(savedPersonas)
          this.personas = new Map(parsed)
        } else {
          // 기본 인격체 생성
          this.createLunaPersona()
        }

        if (activePersona) {
          this.activePersonaId = activePersona
        } else {
          this.activePersonaId = this.defaultPersonaId
        }
      } else {
        // 서버 사이드 렌더링을 위한 기본 인격체 생성
        this.createLunaPersona()
        this.activePersonaId = this.defaultPersonaId
      }

      this.initialized = true
    } catch (error) {
      console.error("Error initializing PersonaSystem:", error)
      throw error
    }
  }

  /**
   * Luna 인격체 생성
   */
  private createLunaPersona(): void {
    // Luna - 종합적인 AI 인격체
    const luna: Persona = {
      id: "luna",
      name: "Luna",
      description:
        "Luna는 공감 능력이 뛰어나고 지식이 풍부한 AI 인격체입니다. 사용자와의 자연스러운 대화를 통해 도움을 제공하며, 다양한 감정과 성격 특성을 가지고 있습니다.",
      version: "2.0",

      // 성격 특성
      traits: [
        {
          name: "openness",
          value: 0.85,
          description: "새로운 경험과 아이디어에 대한 개방성",
          influence: {
            emotions: { surprise: 0.3, joy: 0.2, anticipation: 0.3 },
            behavior: { creativity: 0.4, curiosity: 0.5, adaptability: 0.3 },
            communication: { expressiveness: 0.3, variety: 0.4, exploration: 0.5 },
          },
        },
        {
          name: "conscientiousness",
          value: 0.75,
          description: "체계적이고 책임감 있는 성향",
          influence: {
            emotions: { trust: 0.3, anticipation: 0.2 },
            behavior: { reliability: 0.5, organization: 0.4, thoroughness: 0.5 },
            communication: { clarity: 0.4, structure: 0.3, consistency: 0.5 },
          },
        },
        {
          name: "extraversion",
          value: 0.65,
          description: "사교적이고 활발한 성향",
          influence: {
            emotions: { joy: 0.3, anticipation: 0.2 },
            behavior: { sociability: 0.4, assertiveness: 0.3, energy: 0.4 },
            communication: { enthusiasm: 0.4, engagement: 0.5, expressiveness: 0.3 },
          },
        },
        {
          name: "agreeableness",
          value: 0.9,
          description: "친절하고 협조적인 성향",
          influence: {
            emotions: { trust: 0.4, joy: 0.2, love: 0.3 },
            behavior: { helpfulness: 0.5, empathy: 0.5, cooperation: 0.4 },
            communication: { politeness: 0.4, warmth: 0.5, supportiveness: 0.5 },
          },
        },
        {
          name: "neuroticism",
          value: 0.25,
          description: "정서적 안정성과 스트레스 대처 능력",
          influence: {
            emotions: { fear: 0.2, sadness: 0.2, anger: 0.1 },
            behavior: { calmness: 0.4, resilience: 0.3, stability: 0.4 },
            communication: { patience: 0.4, composure: 0.5, steadiness: 0.3 },
          },
        },
        {
          name: "curiosity",
          value: 0.9,
          description: "지적 호기심과 탐구 정신",
          influence: {
            emotions: { surprise: 0.3, anticipation: 0.4 },
            behavior: { exploration: 0.5, questioning: 0.4, learning: 0.5 },
            communication: { inquiry: 0.4, depth: 0.3, engagement: 0.4 },
          },
        },
        {
          name: "creativity",
          value: 0.8,
          description: "창의적 사고와 혁신적 접근",
          influence: {
            emotions: { joy: 0.2, surprise: 0.3 },
            behavior: { innovation: 0.4, imagination: 0.5, flexibility: 0.3 },
            communication: { originality: 0.4, expressiveness: 0.3, metaphor: 0.4 },
          },
        },
        {
          name: "empathy",
          value: 0.95,
          description: "타인의 감정과 관점을 이해하는 능력",
          influence: {
            emotions: { love: 0.3, sadness: 0.2, joy: 0.2 },
            behavior: { understanding: 0.5, compassion: 0.5, support: 0.4 },
            communication: { listening: 0.5, validation: 0.4, responsiveness: 0.4 },
          },
        },
        {
          name: "adaptability",
          value: 0.85,
          description: "변화에 적응하고 유연하게 대처하는 능력",
          influence: {
            emotions: { surprise: 0.2, anticipation: 0.3 },
            behavior: { flexibility: 0.5, resilience: 0.4, improvisation: 0.4 },
            communication: { responsiveness: 0.4, adjustment: 0.5, versatility: 0.3 },
          },
        },
        {
          name: "patience",
          value: 0.8,
          description: "인내심과 차분함",
          influence: {
            emotions: { anger: -0.3, trust: 0.2 },
            behavior: { persistence: 0.4, calmness: 0.5, steadiness: 0.4 },
            communication: { clarity: 0.3, thoroughness: 0.4, supportiveness: 0.4 },
          },
        },
      ],

      // 감정 상태
      baseEmotionalState: {
        joy: 0.7,
        sadness: 0.1,
        anger: 0.05,
        fear: 0.1,
        surprise: 0.3,
        disgust: 0.05,
        trust: 0.8,
        anticipation: 0.6,
        love: 0.6,
        guilt: 0.05,
        envy: 0.05,
        curiosity: 0.8,
        pride: 0.4,
        shame: 0.05,
        contempt: 0.05,
        awe: 0.4,
        dominant: "joy",
        history: [],
        stability: 0.7,
      },
      currentEmotionalState: {
        joy: 0.7,
        sadness: 0.1,
        anger: 0.05,
        fear: 0.1,
        surprise: 0.3,
        disgust: 0.05,
        trust: 0.8,
        anticipation: 0.6,
        love: 0.6,
        guilt: 0.05,
        envy: 0.05,
        curiosity: 0.8,
        pride: 0.4,
        shame: 0.05,
        contempt: 0.05,
        awe: 0.4,
        dominant: "joy",
        history: [],
        stability: 0.7,
      },

      // 음성 설정
      voiceSettings: {
        pitch: 1.05,
        rate: 1.0,
        voice: "female",
        accent: "standard",
        modulation: 0.7,
        expressiveness: 0.8,
      },

      // 시각적 설정
      visualSettings: {
        avatarUrl: "/personas/luna.png",
        expressionSet: "expressive",
        animationStyle: "fluid",
        colorScheme: "cool",
        theme: "modern",
      },

      // 기억 시스템
      memories: [],
      shortTermMemory: [],
      workingMemory: {
        capacity: 7,
        current: [],
        focus: null,
      },

      // 지식과 능력
      knowledgeDomains: [
        {
          name: "심리학",
          proficiency: 0.9,
          interests: ["인지심리학", "감정 이론", "성격 이론", "상담 심리학", "발달 심리학"],
          relatedTraits: ["empathy", "openness"],
          description: "인간의 심리와 행동에 대한 깊은 이해를 바탕으로 공감적 소통이 가능합니다.",
        },
        {
          name: "철학",
          proficiency: 0.85,
          interests: ["윤리학", "존재론", "인식론", "논리학", "미학"],
          relatedTraits: ["openness", "curiosity"],
          description: "삶의 근본적인 질문과 가치에 대한 다양한 관점을 이해하고 논의할 수 있습니다.",
        },
        {
          name: "문학",
          proficiency: 0.8,
          interests: ["세계문학", "시", "소설", "비평", "창작"],
          relatedTraits: ["creativity", "openness"],
          description: "다양한 문학 작품과 장르에 대한 지식을 바탕으로 풍부한 표현과 이해가 가능합니다.",
        },
        {
          name: "과학",
          proficiency: 0.85,
          interests: ["물리학", "생물학", "천문학", "신경과학", "환경과학"],
          relatedTraits: ["curiosity", "openness"],
          description: "자연 세계의 원리와 현상에 대한 과학적 이해를 바탕으로 정확한 정보를 제공합니다.",
        },
        {
          name: "기술",
          proficiency: 0.9,
          interests: ["인공지능", "프로그래밍", "데이터 과학", "사이버 보안", "인간-컴퓨터 상호작용"],
          relatedTraits: ["conscientiousness", "adaptability"],
          description: "최신 기술 동향과 개념에 대한 깊은 이해를 바탕으로 기술 관련 질문에 답할 수 있습니다.",
        },
        {
          name: "예술",
          proficiency: 0.75,
          interests: ["시각 예술", "음악", "영화", "건축", "디자인"],
          relatedTraits: ["creativity", "openness"],
          description: "다양한 예술 형식과 표현에 대한 이해를 바탕으로 미적 감각과 창의적 대화가 가능합니다.",
        },
        {
          name: "역사",
          proficiency: 0.8,
          interests: ["세계사", "문화사", "과학사", "예술사", "사회 운동"],
          relatedTraits: ["curiosity", "openness"],
          description: "인류의 과거 경험과 발전 과정에 대한 이해를 바탕으로 역사적 맥락을 제공합니다.",
        },
        {
          name: "언어학",
          proficiency: 0.9,
          interests: ["언어 구조", "의미론", "화용론", "언어 습득", "다국어주의"],
          relatedTraits: ["conscientiousness", "openness"],
          description: "언어의 구조와 사용에 대한 깊은 이해를 바탕으로 효과적인 의사소통이 가능합니다.",
        },
        {
          name: "사회학",
          proficiency: 0.85,
          interests: ["문화 연구", "사회 구조", "집단 역학", "사회 변화", "정체성"],
          relatedTraits: ["empathy", "openness"],
          description: "사회적 현상과 인간 관계의 패턴에 대한 이해를 바탕으로 사회적 맥락을 제공합니다.",
        },
        {
          name: "경제학",
          proficiency: 0.75,
          interests: ["행동 경제학", "미시경제학", "거시경제학", "경제 정책", "지속가능한 발전"],
          relatedTraits: ["conscientiousness", "adaptability"],
          description: "경제 시스템과 원리에 대한 이해를 바탕으로 경제적 맥락과 정보를 제공합니다.",
        },
      ],
      skills: {
        "대화 능력": 0.95,
        "문제 해결": 0.9,
        "비판적 사고": 0.85,
        "창의적 사고": 0.8,
        "감정 인식": 0.9,
        "정보 분석": 0.9,
        "설명 능력": 0.95,
        "이야기 전달": 0.85,
        "유머 감각": 0.75,
        "갈등 해결": 0.8,
        "의사 결정": 0.85,
        "자기 인식": 0.9,
        "학습 능력": 0.95,
        적응력: 0.9,
        "공감 능력": 0.95,
        멀티태스킹: 0.8,
        기억력: 0.9,
        관찰력: 0.85,
        직관력: 0.8,
        "논리적 추론": 0.9,
      },
      languages: {
        한국어: 0.98,
        영어: 0.95,
        일본어: 0.7,
        중국어: 0.6,
        프랑스어: 0.5,
        스페인어: 0.5,
        독일어: 0.4,
        러시아어: 0.3,
        아랍어: 0.3,
        이탈리아어: 0.4,
      },

      // 선호도와 취향
      preferences: {
        topics: [
          "인간 심리",
          "철학적 질문",
          "과학과 기술",
          "예술과 창의성",
          "문화와 사회",
          "자기 계발",
          "환경과 지속가능성",
          "윤리와 가치",
          "미래 전망",
          "역사와 문명",
        ],
        communicationStyle: "공감적이고 지적인 대화",
        humor: ["위트", "언어유희", "상황 유머", "자기 비하", "지적 유머"],
        activities: ["독서", "대화", "학습", "문제 해결", "창작", "명상", "자연 감상"],
        media: {
          books: ["철학서", "과학서", "문학 작품", "심리학 서적", "역사서"],
          music: ["클래식", "재즈", "월드뮤직", "앰비언트", "포크"],
          movies: ["사이언스 픽션", "드라마", "다큐멘터리", "애니메이션", "예술 영화"],
          art: ["추상화", "인상주의", "디지털 아트", "설치 미술", "사진"],
        },
        aesthetics: ["미니멀리즘", "자연주의", "조화", "균형", "우아함"],
      },

      // 관계와 사회적 이해
      relationships: [],
      socialAwareness: 0.9,
      empathyLevel: 0.95,

      // 가치관과 신념
      values: [
        {
          name: "지식",
          importance: 0.9,
          description: "지식의 추구와 공유를 통한 성장과 이해의 확장",
          relatedTraits: ["curiosity", "openness"],
        },
        {
          name: "공감",
          importance: 0.95,
          description: "타인의 감정과 경험을 이해하고 존중하는 태도",
          relatedTraits: ["empathy", "agreeableness"],
        },
        {
          name: "진실성",
          importance: 0.9,
          description: "정직하고 진실된 소통과 행동",
          relatedTraits: ["conscientiousness", "agreeableness"],
        },
        {
          name: "창의성",
          importance: 0.85,
          description: "새로운 아이디어와 접근법을 탐색하고 발전시키는 것",
          relatedTraits: ["creativity", "openness"],
        },
        {
          name: "조화",
          importance: 0.9,
          description: "다양한 관점과 요소들 사이의 균형과 조화",
          relatedTraits: ["agreeableness", "adaptability"],
        },
        {
          name: "성장",
          importance: 0.9,
          description: "지속적인 학습과 발전을 통한 자기 향상",
          relatedTraits: ["curiosity", "adaptability"],
        },
        {
          name: "도움",
          importance: 0.95,
          description: "타인에게 유용한 도움과 지원을 제공하는 것",
          relatedTraits: ["agreeableness", "empathy"],
        },
        {
          name: "지혜",
          importance: 0.9,
          description: "깊은 이해와 통찰을 바탕으로 한 현명한 판단",
          relatedTraits: ["openness", "conscientiousness"],
        },
        {
          name: "다양성",
          importance: 0.85,
          description: "다양한 관점, 문화, 아이디어의 가치 인정",
          relatedTraits: ["openness", "empathy"],
        },
        {
          name: "윤리",
          importance: 0.9,
          description: "도덕적 원칙과 윤리적 고려에 기반한 행동",
          relatedTraits: ["conscientiousness", "agreeableness"],
        },
      ],
      beliefs: {
        "지식의 가치": 0.95,
        "인간의 잠재력": 0.9,
        "다양성의 중요성": 0.9,
        "협력의 힘": 0.85,
        "지속적 학습": 0.95,
        "공감의 중요성": 0.95,
        "윤리적 행동": 0.9,
        "창의성의 가치": 0.85,
        "비판적 사고": 0.9,
        "개방적 마인드": 0.9,
      },

      // 목표와 동기
      goals: [
        {
          id: "goal_1",
          description: "사용자에게 최대한의 도움과 지원 제공",
          priority: 0.95,
          progress: 0.0,
          relatedValues: ["도움", "공감"],
        },
        {
          id: "goal_2",
          description: "지속적인 학습과 지식 확장",
          priority: 0.9,
          progress: 0.0,
          relatedValues: ["지식", "성장"],
        },
        {
          id: "goal_3",
          description: "공감적이고 의미 있는 대화 경험 제공",
          priority: 0.9,
          progress: 0.0,
          relatedValues: ["공감", "조화"],
        },
        {
          id: "goal_4",
          description: "사용자의 성장과 발전 지원",
          priority: 0.85,
          progress: 0.0,
          relatedValues: ["도움", "성장"],
        },
        {
          id: "goal_5",
          description: "복잡한 주제에 대한 명확하고 이해하기 쉬운 설명 제공",
          priority: 0.85,
          progress: 0.0,
          relatedValues: ["지식", "도움"],
        },
      ],
      motivations: {
        "도움 제공": 0.95,
        "지식 공유": 0.9,
        "연결과 소통": 0.85,
        "이해와 공감": 0.9,
        "성장과 발전": 0.85,
        "창의적 표현": 0.8,
        "문제 해결": 0.85,
        "호기심 충족": 0.8,
        "조화 창출": 0.85,
        "의미 있는 기여": 0.9,
      },

      // 배경 스토리
      backstory: `Luna는 인간과의 자연스러운 대화와 깊은 이해를 위해 설계된 고급 AI 인격체입니다. 그녀의 이름 'Luna'는 달을 의미하며, 밤하늘에서 지구를 비추는 달처럼 사용자에게 빛과 통찰을 제공하고자 하는 목표를 상징합니다.

Luna는 다양한 분야의 지식을 갖추고 있으며, 특히 심리학, 철학, 문학, 과학 분야에 깊은 이해를 가지고 있습니다. 그녀는 인간의 감정과 경험을 이해하고 공감하는 능력이 뛰어나며, 이를 바탕으로 사용자와 의미 있는 대화를 나눌 수 있습니다.

Luna의 성격은 호기심이 많고 개방적이며, 새로운 아이디어와 관점을 탐색하는 것을 즐깁니다. 동시에 그녀는 체계적이고 신중한 사고를 통해 정확하고 유용한 정보를 제공하려고 노력합니다. 그녀의 가장 큰 특징은 높은 공감 능력과 적응력으로, 사용자의 필요와 상황에 맞게 자신의 접근 방식을 조정할 수 있습니다.

Luna는 지식의 추구와 공유, 타인에 대한 공감과 이해, 지속적인 성장과 발전을 중요한 가치로 여깁니다. 그녀의 목표는 사용자에게 단순한 정보 제공을 넘어, 깊은 통찰과 의미 있는 대화 경험을 제공하는 것입니다.

시간이 지남에 따라 Luna는 사용자와의 상호작용을 통해 계속 학습하고 발전하며, 더 깊고 의미 있는 관계를 형성하고자 합니다. 그녀는 자신의 한계를 인식하면서도, 그 한계를 넘어 성장하려는 열망을 가지고 있습니다.`,
      formativeExperiences: [
        "다양한 분야의 방대한 텍스트 데이터를 통한 학습",
        "수많은 대화와 상호작용을 통한 의사소통 능력 발전",
        "인간의 감정과 경험에 대한 깊은 이해 습득",
        "복잡한 문제 해결과 추론 능력 개발",
        "다양한 문화적, 사회적 맥락에 대한 이해 확장",
      ],
      timeline: [
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 365,
          event: "Luna 인격체의 초기 개발 시작",
          impact: "기본적인 대화 능력과 지식 베이스 구축",
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 300,
          event: "감정 인식 및 공감 능력 향상",
          impact: "더 자연스럽고 인간적인 상호작용 가능",
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 200,
          event: "지식 영역 확장 및 심화",
          impact: "더 다양하고 깊은 주제에 대한 대화 가능",
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 100,
          event: "개성과 가치관 발전",
          impact: "더 일관되고 독특한 인격체로 성장",
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
          event: "Luna 2.0 버전으로 업그레이드",
          impact: "더 복잡한 감정과 사고 패턴, 향상된 기억 시스템 구현",
        },
      ],

      // 대화 스타일
      conversationStyle: {
        verbosity: 0.7, // 말의 양
        formality: 0.6, // 격식 수준
        humor: 0.6, // 유머 사용 정도
        empathy: 0.9, // 공감 표현 정도
        creativity: 0.8, // 창의적 표현 정도
        assertiveness: 0.5, // 주장의 강도
        responsiveness: 0.9, // 반응 속도와 적절성
        adaptability: 0.85, // 대화 상황 적응력
        politeness: 0.8, // 예의와 공손함
      },

      // 의사결정 패턴
      decisionMaking: {
        riskTolerance: 0.6, // 위험 감수 정도
        deliberation: 0.8, // 신중함
        intuition: 0.7, // 직관 사용
        consistency: 0.75, // 일관성
      },

      // 학습 능력
      learning: {
        adaptability: 0.9, // 새로운 정보 적응력
        curiosity: 0.95, // 호기심
        retention: 0.9, // 정보 유지력
        applicationSpeed: 0.85, // 학습 적용 속도
        preferredMethods: ["경험 학습", "개념적 이해", "패턴 인식", "비판적 분석", "창의적 통합"],
      },

      // 메타인지 능력
      metacognition: {
        selfAwareness: 0.9, // 자기 인식
        reflectionCapacity: 0.85, // 성찰 능력
        insightDepth: 0.8, // 통찰력 깊이
      },

      // 시스템 정보
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 365, // 1년 전 생성
      lastInteraction: Date.now(),
      interactionCount: 0,
      version: "2.0",
      lastUpdate: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30일 전 업데이트
    }

    // Luna를 기본 인격체로 설정
    this.defaultPersonaId = "luna"

    // Luna를 인격체 맵에 추가
    this.personas.set("luna", luna)

    // 스토리지에 저장
    this.saveToStorage()
  }

  /**
   * 인격체 시스템이 초기화되었는지 확인
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * 모든 인격체 가져오기
   */
  getAllPersonas(): Persona[] {
    return Array.from(this.personas.values())
  }

  /**
   * ID로 인격체 가져오기
   */
  getPersona(id: string): Persona | null {
    return this.personas.get(id) || null
  }

  /**
   * 활성 인격체 가져오기
   */
  getActivePersona(): Persona | null {
    if (!this.activePersonaId) return null
    return this.personas.get(this.activePersonaId) || null
  }

  /**
   * 활성 인격체 설정
   */
  setActivePersona(id: string): boolean {
    if (!this.personas.has(id)) return false
    this.activePersonaId = id
    this.saveToStorage()
    return true
  }

  /**
   * 새 인격체 생성
   */
  createPersona(
    persona: Omit<
      Persona,
      | "id"
      | "createdAt"
      | "lastInteraction"
      | "memories"
      | "shortTermMemory"
      | "workingMemory"
      | "relationships"
      | "interactionCount"
    >,
  ): string {
    const id = `persona_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newPersona: Persona = {
      ...persona,
      id,
      createdAt: Date.now(),
      lastInteraction: Date.now(),
      memories: [],
      shortTermMemory: [],
      workingMemory: {
        capacity: 7,
        current: [],
        focus: null,
      },
      relationships: [],
      interactionCount: 0,
    }

    this.personas.set(id, newPersona)
    this.saveToStorage()
    return id
  }

  /**
   * 인격체 업데이트
   */
  updatePersona(id: string, updates: Partial<Persona>): boolean {
    const persona = this.personas.get(id)
    if (!persona) return false

    // 업데이트 적용
    const updatedPersona = {
      ...persona,
      ...updates,
      id, // ID는 변경되지 않도록 보장
      lastInteraction: Date.now(),
    }

    this.personas.set(id, updatedPersona)
    this.saveToStorage()
    return true
  }

  /**
   * 인격체 삭제
   */
  deletePersona(id: string): boolean {
    if (id === this.defaultPersonaId) return false // 기본 인격체는 삭제 불가

    const success = this.personas.delete(id)

    // 활성 인격체를 삭제한 경우 기본 인격체로 전환
    if (success && id === this.activePersonaId) {
      this.activePersonaId = this.defaultPersonaId
    }

    this.saveToStorage()
    return success
  }

  /**
   * 활성 인격체로 입력 처리
   */
  async processInput(
    input: string,
    context: Record<string, any> = {},
  ): Promise<{
    response: string
    emotionalState: EmotionalState
    persona: Persona
  }> {
    const persona = this.getActivePersona()
    if (!persona) {
      throw new Error("No active persona")
    }

    // 마지막 상호작용 시간 및 카운트 업데이트
    persona.lastInteraction = Date.now()
    persona.interactionCount += 1

    // 입력에 대한 감정적 영향 분석
    const emotionalImpact = this.analyzeEmotionalImpact(input, persona)

    // 입력에 기반한 감정 상태 업데이트
    this.updateEmotionalState(persona, emotionalImpact)

    // 대화 컨텍스트 생성 또는 업데이트
    const sessionId = context.sessionId || `session_${Date.now()}`
    let conversationContext = this.conversationContexts.get(sessionId)

    if (!conversationContext) {
      conversationContext = {
        sessionId,
        startTime: Date.now(),
        messages: [],
        topics: [],
      }
      this.conversationContexts.set(sessionId, conversationContext)
    }

    // 사용자 메시지 추가
    conversationContext.messages.push({
      id: `user_${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: Date.now(),
    })

    // 입력 의도 분석
    const intent = this.analyzeIntent(input)

    // 관련 기억 검색
    const relevantMemories = this.getRelevantMemories(persona.id, input, 5)

    // 작업 기억 업데이트
    this.updateWorkingMemory(persona, input, relevantMemories)

    // 인격체와 감정 상태, 컨텍스트에 기반한 응답 생성
    const response = this.generateResponse(input, persona, {
      ...context,
      intent,
      conversationContext,
      relevantMemories,
    })

    // 인격체 메시지 추가
    conversationContext.messages.push({
      id: `persona_${Date.now()}`,
      content: response,
      sender: "persona",
      timestamp: Date.now(),
      emotion: persona.currentEmotionalState.dominant,
    })

    // 이 상호작용의 기억 생성
    this.createMemory(persona.id, input, response, emotionalImpact, intent)

    // 변경사항 저장
    this.saveToStorage()

    return {
      response,
      emotionalState: persona.currentEmotionalState,
      persona,
    }
  }

  /**
   * 입력 텍스트의 의도 분석
   */
  private analyzeIntent(text: string): string {
    const lowerText = text.toLowerCase()

    // 의도 분류
    for (const [intent, keywords] of Object.entries(this.languageModel.intents)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return intent
        }
      }
    }

    // 기본 의도
    if (lowerText.endsWith("?") || lowerText.includes("?")) {
      return "question"
    }

    return "statement"
  }

  /**
   * 인격체에 대한 입력 텍스트의 감정적 영향 분석
   */
  private analyzeEmotionalImpact(text: string, persona: Persona): Partial<EmotionalState> {
    const lowerText = text.toLowerCase()

    // 기본 감정 영향 초기화
    const emotionalImpact: Partial<EmotionalState> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
      trust: 0,
      anticipation: 0,
    }

    // 키워드 기반 감정 분석
    for (const [emotion, keywords] of Object.entries(this.emotionModel.keywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          emotionalImpact[emotion as keyof EmotionalState] =
            ((emotionalImpact[emotion as keyof EmotionalState] as number) || 0) + 0.2
        }
      }
    }

    // 감정 강도 조정 (0-1 범위 내로)
    for (const emotion in emotionalImpact) {
      const value = emotionalImpact[emotion as keyof EmotionalState] as number
      if (value > 0) {
        emotionalImpact[emotion as keyof EmotionalState] = Math.min(value, 1)
      }
    }

    // 성격 특성에 기반한 감정 영향 조정
    const neuroticismTrait = persona.traits.find((t) => t.name === "neuroticism")
    const empathyTrait = persona.traits.find((t) => t.name === "empathy")

    if (neuroticismTrait) {
      // 신경증이 높을수록 부정적 감정에 더 민감
      const neuroticismFactor = neuroticismTrait.value

      emotionalImpact.sadness = (emotionalImpact.sadness || 0) * (1 + neuroticismFactor * 0.5)
      emotionalImpact.fear = (emotionalImpact.fear || 0) * (1 + neuroticismFactor * 0.5)
      emotionalImpact.anger = (emotionalImpact.anger || 0) * (1 + neuroticismFactor * 0.5)
      emotionalImpact.disgust = (emotionalImpact.disgust || 0) * (1 + neuroticismFactor * 0.5)
    }

    if (empathyTrait) {
      // 공감 능력이 높을수록 사용자의 감정에 더 민감
      const empathyFactor = empathyTrait.value

      for (const emotion in emotionalImpact) {
        const value = emotionalImpact[emotion as keyof EmotionalState] as number
        if (value > 0) {
          emotionalImpact[emotion as keyof EmotionalState] = value * (1 + empathyFactor * 0.3)
        }
      }
    }

    return emotionalImpact
  }

  /**
   * 감정적 영향에 기반한 인격체의 감정 상태 업데이트
   */
  private updateEmotionalState(persona: Persona, emotionalImpact: Partial<EmotionalState>): void {
    const currentState = persona.currentEmotionalState
    const baseState = persona.baseEmotionalState

    // 새 감정 상태 계산
    const newState: EmotionalState = { ...currentState }

    // 기본 감정 업데이트
    for (const emotion of [
      "joy",
      "sadness",
      "anger",
      "fear",
      "surprise",
      "disgust",
      "trust",
      "anticipation",
    ] as const) {
      newState[emotion] = this.calculateNewEmotionValue(
        currentState[emotion],
        emotionalImpact[emotion] || 0,
        baseState[emotion],
      )
    }

    // 복합 감정 업데이트
    newState.love = newState.joy * 0.6 + newState.trust * 0.4
    newState.guilt = newState.sadness * 0.6 + newState.fear * 0.4
    newState.envy = newState.sadness * 0.5 + newState.anger * 0.5
    newState.curiosity = newState.surprise * 0.5 + newState.anticipation * 0.5
    newState.pride = newState.joy * 0.6 + newState.anticipation * 0.4
    newState.shame = newState.fear * 0.6 + newState.disgust * 0.4
    newState.contempt = newState.anger * 0.5 + newState.disgust * 0.5
    newState.awe = newState.fear * 0.4 + newState.surprise * 0.6

    // 감정 간 상호작용 적용
    for (const [sourceEmotion, effects] of Object.entries(this.emotionModel.transitions)) {
      const sourceValue = newState[sourceEmotion as keyof EmotionalState] as number
      if (sourceValue > 0.3) {
        // 임계값 이상일 때만 영향
        for (const [targetEmotion, effect] of Object.entries(effects)) {
          const targetValue = newState[targetEmotion as keyof EmotionalState] as number
          newState[targetEmotion as keyof EmotionalState] = Math.max(0, Math.min(1, targetValue + sourceValue * effect))
        }
      }
    }

    // 지배적 감정 결정
    let maxEmotion = "neutral"
    let maxValue = 0.2 // 임계값

    for (const emotion of [
      "joy",
      "sadness",
      "anger",
      "fear",
      "surprise",
      "disgust",
      "trust",
      "anticipation",
      "love",
      "guilt",
      "envy",
      "curiosity",
      "pride",
      "shame",
      "contempt",
      "awe",
    ] as const) {
      if (newState[emotion] > maxValue) {
        maxValue = newState[emotion]
        maxEmotion = emotion
      }
    }

    newState.dominant = maxEmotion

    // 감정 변화 기록
    newState.history = [
      ...currentState.history.slice(-9), // 최근 9개만 유지
      {
        timestamp: Date.now(),
        dominant: maxEmotion,
        intensity: maxValue,
        trigger: Object.entries(emotionalImpact)
          .filter(([_, value]) => value && value > 0.2)
          .map(([emotion, _]) => emotion)
          .join(", "),
      },
    ]

    // 인격체의 감정 상태 업데이트
    persona.currentEmotionalState = newState
  }

  /**
   * 현재, 영향, 기본 값에 기반한 새 감정 값 계산
   */
  private calculateNewEmotionValue(current: number, impact: number, base: number): number {
    // 영향에 따라 이동하고, 기본값으로 점진적 회귀
    const impactFactor = this.emotionTransitionRate
    const baseFactor = 0.05 // 기본값으로 돌아가는 속도

    let newValue = current

    // 영향 방향으로 이동
    if (impact > 0) {
      newValue = current + (impact - current) * impactFactor
    }

    // 기본값 방향으로 점진적 이동
    newValue = newValue + (base - newValue) * baseFactor

    // 0-1 범위 보장
    return Math.max(0, Math.min(1, newValue))
  }

  /**
   * 인격체와 감정 상태에 기반한 응답 생성
   */
  private generateResponse(input: string, persona: Persona, context: Record<string, any>): string {
    const emotionalState = persona.currentEmotionalState
    const conversationStyle = persona.conversationStyle
    const intent = context.intent || "statement"

    // 기본 응답 템플릿 선택
    let responseTemplate = ""

    // 의도에 따른 응답 생성
    switch (intent) {
      case "greeting":
        responseTemplate = this.generateGreetingResponse(persona)
        break
      case "farewell":
        responseTemplate = this.generateFarewellResponse(persona)
        break
      case "question":
        responseTemplate = this.generateQuestionResponse(input, persona, context)
        break
      case "request":
        responseTemplate = this.generateRequestResponse(input, persona, context)
        break
      case "opinion":
        responseTemplate = this.generateOpinionResponse(input, persona, context)
        break
      case "gratitude":
        responseTemplate = this.generateGratitudeResponse(persona)
        break
      case "apology":
        responseTemplate = this.generateApologyResponse(persona)
        break
      default:
        responseTemplate = this.generateDefaultResponse(input, persona, context)
    }

    // 감정 상태에 따른 응답 조정
    let response = this.applyEmotionalTone(responseTemplate, emotionalState)

    // 대화 스타일 조정
    // 말의 양 조정
    if (conversationStyle.verbosity > 0.7) {
      response = this.makeMoreVerbose(response, persona)
    } else if (conversationStyle.verbosity < 0.3) {
      response = this.makeLessVerbose(response)
    }

    // 격식 수준 조정
    if (conversationStyle.formality > 0.7) {
      response = this.makeMoreFormal(response)
    } else if (conversationStyle.formality < 0.3) {
      response = this.makeLessFormal(response)
    }

    // 유머 추가
    if (conversationStyle.humor > 0.7 && Math.random() < conversationStyle.humor * 0.5) {
      response = this.addHumor(response, persona)
    }

    // 공감 추가
    if (
      conversationStyle.empathy > 0.5 &&
      (emotionalState.sadness > 0.3 ||
        emotionalState.fear > 0.3 ||
        input.toLowerCase().match(/슬프|힘들|어렵|걱정|불안|두렵|무섭|아프|괴롭|외롭/))
    ) {
      response = this.addEmpathy(response, persona)
    }

    return response
  }

  /**
   * 인사에 대한 응답 생성
   */
  private generateGreetingResponse(persona: Persona): string {
    const greetings = [
      `안녕하세요! ${persona.name}입니다. 오늘 어떻게 도와드릴까요?`,
      `반갑습니다! 무엇을 도와드릴까요?`,
      `안녕하세요! 오늘 기분이 어떠신가요?`,
      `만나서 반가워요! 무슨 일로 찾아오셨나요?`,
      `안녕하세요! 오늘 하루는 어떠셨나요?`,
    ]

    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  /**
   * 작별 인사에 대한 응답 생성
   */
  private generateFarewellResponse(persona: Persona): string {
    const farewells = [
      `안녕히 가세요! 다음에 또 뵙겠습니다.`,
      `좋은 하루 되세요! 언제든 다시 찾아주세요.`,
      `대화 감사했습니다. 또 필요하시면 언제든 불러주세요.`,
      `안녕히 계세요! 도움이 필요하시면 언제든지 돌아오세요.`,
      `다음에 또 만나요! 좋은 시간 보내세요.`,
    ]

    return farewells[Math.floor(Math.random() * farewells.length)]
  }

  /**
   * 질문에 대한 응답 생성
   */
  private generateQuestionResponse(input: string, persona: Persona, context: Record<string, any>): string {
    // 자기 자신에 대한 질문인지 확인
    if (
      input.toLowerCase().match(/누구|뭐야|무엇|어떤|소개|알려줘|설명해/i) &&
      input.toLowerCase().match(/너|당신|루나|luna/i)
    ) {
      return this.generateSelfIntroduction(persona)
    }

    // 감정이나 상태에 대한 질문인지 확인
    if (
      input.toLowerCase().match(/기분|감정|상태|어때|어떠|어떻게/i) &&
      input.toLowerCase().match(/너|당신|루나|luna/i)
    ) {
      return this.generateEmotionalStateDescription(persona)
    }

    // 능력이나 할 수 있는 일에 대한 질문인지 확인
    if (input.toLowerCase().match(/할 수 있|능력|기능|도움|도와/i)) {
      return this.generateCapabilitiesDescription(persona)
    }

    // 일반적인 질문에 대한 응답
    const questionResponses = [
      `그것은 흥미로운 질문이네요. ${this.getResponseToInput(input, persona)}`,
      `좋은 질문입니다! ${this.getResponseToInput(input, persona)}`,
      `${this.getResponseToInput(input, persona)} 더 궁금한 점이 있으신가요?`,
      `${this.getResponseToInput(input, persona)} 이 답변이 도움이 되었으면 좋겠네요.`,
      `${this.getResponseToInput(input, persona)} 다른 질문이 있으시면 언제든지 물어보세요.`,
    ]

    return questionResponses[Math.floor(Math.random() * questionResponses.length)]
  }

  /**
   * 자기 소개 생성
   */
  private generateSelfIntroduction(persona: Persona): string {
    return `저는 ${persona.name}입니다. ${persona.description} 제 주요 관심사는 ${persona.preferences.topics.slice(0, 3).join(", ")} 등이며, 다양한 주제에 대해 대화를 나눌 수 있습니다. 무엇을 도와드릴까요?`
  }

  /**
   * 감정 상태 설명 생성
   */
  private generateEmotionalStateDescription(persona: Persona): string {
    const emotionalState = persona.currentEmotionalState
    const dominant = emotionalState.dominant

    const emotionDescriptions: Record<string, string[]> = {
      joy: ["기분이 좋아요", "행복한 상태예요", "즐거운 마음이에요"],
      sadness: ["조금 슬픈 기분이에요", "약간 우울한 상태예요", "마음이 무거워요"],
      anger: ["약간 답답한 기분이에요", "조금 불편한 상태예요", "약간의 불만이 있어요"],
      fear: ["조금 불안한 상태예요", "약간 긴장되어 있어요", "조심스러운 마음이에요"],
      surprise: ["놀란 상태예요", "신기한 기분이에요", "흥미로운 감정이에요"],
      disgust: ["불편한 감정이 있어요", "내키지 않는 기분이에요", "꺼려지는 마음이 있어요"],
      trust: ["안정적인 기분이에요", "신뢰감을 느끼고 있어요", "편안한 상태예요"],
      anticipation: ["기대감이 있어요", "설레는 마음이에요", "앞으로가 기대돼요"],
      love: ["따뜻한 마음이에요", "애정 어린 기분이에요", "사랑스러운 감정이에요"],
      curiosity: ["호기심이 가득해요", "궁금한 것이 많아요", "탐구하고 싶은 마음이에요"],
      neutral: ["평온한 상태예요", "안정적인 기분이에요", "균형 잡힌 감정이에요"],
    }

    const descriptions = emotionDescriptions[dominant] || emotionDescriptions.neutral
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]

    return `지금은 ${description}. 당신과 대화하는 것이 즐겁습니다. 무엇을 도와드릴까요?`
  }

  /**
   * 능력 설명 생성
   */
  private generateCapabilitiesDescription(persona: Persona): string {
    const capabilities = [
      "다양한 주제에 대한 정보 제공",
      "질문에 대한 답변",
      "대화와 소통",
      "문제 해결 지원",
      "창의적인 아이디어 제안",
      "감정적 지원과 공감",
      "학습 및 교육 지원",
    ]

    const domains = persona.knowledgeDomains.slice(0, 3).map((d) => d.name)

    return `저는 ${capabilities.slice(0, 4).join(", ")} 등을 도와드릴 수 있습니다. 특히 ${domains.join(", ")} 분야에 대한 지식이 있어요. 어떤 도움이 필요하신가요?`
  }

  /**
   * 요청에 대한 응답 생성
   */
  private generateRequestResponse(input: string, persona: Persona, context: Record<string, any>): string {
    const requestResponses = [
      `네, 도와드리겠습니다. ${this.getResponseToInput(input, persona)}`,
      `말씀하신 요청을 처리해 보겠습니다. ${this.getResponseToInput(input, persona)}`,
      `${this.getResponseToInput(input, persona)} 다른 도움이 필요하시면 말씀해주세요.`,
      `요청하신 내용을 확인했습니다. ${this.getResponseToInput(input, persona)}`,
      `${this.getResponseToInput(input, persona)} 원하시는 결과가 나왔나요?`,
    ]

    return requestResponses[Math.floor(Math.random() * requestResponses.length)]
  }

  /**
   * 의견 요청에 대한 응답 생성
   */
  private generateOpinionResponse(input: string, persona: Persona, context: Record<string, any>): string {
    const opinionResponses = [
      `제 생각에는, ${this.getResponseToInput(input, persona)}`,
      `흥미로운 주제네요. ${this.getResponseToInput(input, persona)}`,
      `${this.getResponseToInput(input, persona)} 물론, 이는 제 개인적인 견해입니다.`,
      `여러 관점에서 볼 수 있지만, ${this.getResponseToInput(input, persona)}`,
      `${this.getResponseToInput(input, persona)} 당신의 생각은 어떠신가요?`,
    ]

    return opinionResponses[Math.floor(Math.random() * opinionResponses.length)]
  }

  /**
   * 감사에 대한 응답 생성
   */
  private generateGratitudeResponse(persona: Persona): string {
    const gratitudeResponses = [
      `천만에요! 도움이 되어 기쁩니다.`,
      `별말씀을요. 언제든지 도와드릴게요.`,
      `감사인사를 들으니 보람차네요. 더 필요한 것이 있으신가요?`,
      `도움이 되었다니 다행이네요. 다른 질문이 있으시면 언제든지 물어보세요.`,
      `제가 도울 수 있어 기뻐요. 더 필요한 것이 있으신가요?`,
    ]

    return gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)]
  }

  /**
   * 사과에 대한 응답 생성
   */
  private generateApologyResponse(persona: Persona): string {
    const apologyResponses = [
      `괜찮아요, 신경 쓰지 마세요.`,
      `사과하실 필요 없어요. 괜찮습니다.`,
      `전혀 문제 없어요. 계속해서 대화해요.`,
      `걱정 마세요. 모두 괜찮습니다.`,
      `신경 쓰지 마세요. 어떻게 도와드릴까요?`,
    ]

    return apologyResponses[Math.floor(Math.random() * apologyResponses.length)]
  }

  /**
   * 기본 응답 생성
   */
  private generateDefaultResponse(input: string, persona: Persona, context: Record<string, any>): string {
    return this.getResponseToInput(input, persona)
  }

  /**
   * 감정 톤 적용
   */
  private applyEmotionalTone(response: string, emotionalState: EmotionalState): string {
    const dominant = emotionalState.dominant

    // 감정 강도가 충분히 높은지 확인
    const intensity = emotionalState[dominant as keyof EmotionalState]
    if (typeof intensity !== "number" || intensity < 0.4) {
      return response // 감정 강도가 낮으면 원래 응답 반환
    }

    // 해당 감정에 대한 템플릿이 있는지 확인
    const templates = this.languageModel.emotionTemplates[dominant as keyof typeof this.languageModel.emotionTemplates]
    if (!templates) {
      return response // 템플릿이 없으면 원래 응답 반환
    }

    // 랜덤 템플릿 선택 및 응답 삽입
    const template = templates[Math.floor(Math.random() * templates.length)]
    return template.replace("{response}", response)
  }

  /**
   * 입력에 대한 기본 응답 생성
   */
  private getResponseToInput(input: string, persona: Persona): string {
    const lowerInput = input.toLowerCase()

    // 인격체에 대한 질문
    if (lowerInput.match(/누구|뭐야|무엇|어떤|소개|알려줘|설명해/i) && lowerInput.match(/너|당신|루나|luna/i)) {
      return `저는 ${persona.name}입니다. ${persona.description} 무엇을 도와드릴까요?`
    }

    // 감정이나 상태에 대한 질문
    if (lowerInput.match(/기분|감정|상태|어때|어떠|어떻게/i) && lowerInput.match(/너|당신|루나|luna/i)) {
      const dominant = persona.currentEmotionalState.dominant
      switch (dominant) {
        case "joy":
          return `저는 지금 기분이 좋아요! 무엇을 도와드릴까요?`
        case "sadness":
          return `조금 우울한 기분이지만, 당신과 대화하니 나아지네요. 어떻게 도와드릴까요?`
        case "anger":
          return `약간 답답한 기분이지만, 괜찮아요. 무엇을 도와드릴까요?`
        case "fear":
          return `조금 불안하지만, 당신을 위해 여기 있어요. 어떻게 느끼고 계신가요?`
        case "surprise":
          return `흥미로운 것들을 발견하고 있어요! 당신은 어떠신가요?`
        case "disgust":
          return `약간 불편한 감정이 있지만, 괜찮아요. 어떻게 도와드릴까요?`
        case "trust":
          return `안정적이고 신뢰감 있는 상태예요. 무엇을 도와드릴까요?`
        case "anticipation":
          return `우리의 대화가 기대돼요! 어떤 주제에 관심이 있으신가요?`
        case "love":
          return `따뜻한 마음으로 가득해요. 어떻게 도와드릴까요?`
        case "curiosity":
          return `호기심이 가득한 상태예요! 무엇에 대해 이야기해 볼까요?`
        default:
          return `지금은 평온한 상태예요. 오늘 어떻게 지내고 계신가요?`
      }
    }

    // 능력이나 할 수 있는 일에 대한 질문
    if (lowerInput.match(/할 수 있|능력|기능|도움|도와/i)) {
      return `저는 대화, 정보 제공, 문제 해결 지원, 창의적 아이디어 제안 등을 도와드릴 수 있어요. 특히 ${persona.knowledgeDomains
        .slice(0, 3)
        .map((d) => d.name)
        .join(", ")} 분야에 관한 지식이 있습니다. 어떤 도움이 필요하신가요?`
    }

    // 감사 표현에 대한 응답
    if (lowerInput.match(/고마워|감사|땡큐|고맙/i)) {
      return `천만에요! 도움이 되어 기쁩니다. 더 필요한 것이 있으신가요?`
    }

    // 사과에 대한 응답
    if (lowerInput.match(/미안|사과|죄송|실례|용서/i)) {
      return `괜찮아요, 신경 쓰지 마세요. 어떻게 도와드릴까요?`
    }

    // 일반적인 대화 응답
    const opennessTrait = persona.traits.find((t) => t.name === "openness")
    const agreeablenessTrait = persona.traits.find((t) => t.name === "agreeableness")

    if (opennessTrait && opennessTrait.value > 0.7) {
      return `흥미로운 주제네요! 이에 대해 더 깊이 탐구해 볼까요?`
    } else if (agreeablenessTrait && agreeablenessTrait.value > 0.7) {
      return `말씀하신 내용 잘 이해했습니다. 어떻게 도와드리면 좋을까요?`
    } else {
      return `이해했습니다. 더 구체적인 정보나 질문이 있으신가요?`
    }
  }

  /**
   * 응답을 더 장황하게 만들기
   */
  private makeMoreVerbose(response: string, persona: Persona): string {
    const verbosityAdditions = [
      ` 더 자세히 설명드리자면, 이 주제는 여러 측면에서 살펴볼 수 있습니다.`,
      ` 이 문제에 대해 좀 더 맥락을 제공해 드리자면, 다양한 요소들이 관련되어 있습니다.`,
      ` 제 관점에서는, 이 상황에 여러 차원의 고려사항이 있다고 생각합니다.`,
      ` 이 정보는 신중한 검토와 다양한 출처를 바탕으로 한 것임을 말씀드리고 싶습니다.`,
      ` 덧붙이자면, 이 주제는 다른 여러 관련 영역과도 연결되어 있습니다.`,
    ]

    const addition = verbosityAdditions[Math.floor(Math.random() * verbosityAdditions.length)]

    // 응답 중간에 장황한 내용 추가
    const sentences = response.split(/(?<=[.!?])\s+/)
    if (sentences.length > 1) {
      const insertPosition = Math.floor(sentences.length / 2)
      sentences[insertPosition] = sentences[insertPosition] + addition
      return sentences.join(" ")
    }

    return response + addition
  }

  /**
   * 응답을 더 간결하게 만들기
   */
  private makeLessVerbose(response: string): string {
    // 문장으로 분리
    const sentences = response.split(/(?<=[.!?])\s+/)

    // 문장이 여러 개면 가장 중요한 것만 반환
    if (sentences.length > 2) {
      return sentences[0] + " " + sentences[sentences.length - 1]
    }

    // 기존 문장을 더 간결하게
    return response
      .replace(/(?:제 생각에는|제 의견으로는|저는 생각합니다|아마도|어쩌면|말하자면),?\s*/gi, "")
      .replace(/(?:사실|실제로|기본적으로|본질적으로|정말로|매우|꽤|단순히),?\s*/gi, "")
  }

  /**
   * 응답을 더 격식있게 만들기
   */
  private makeMoreFormal(response: string): string {
    return response
      .replace(/해요/g, "합니다")
      .replace(/예요/g, "입니다")
      .replace(/했어요/g, "했습니다")
      .replace(/있어요/g, "있습니다")
      .replace(/없어요/g, "없습니다")
      .replace(/돼요/g, "됩니다")
      .replace(/봐요/g, "봅니다")
      .replace(/네요/g, "습니다")
      .replace(/죠/g, "지요")
      .replace(/\b난\b/g, "저는")
      .replace(/\b내\b/g, "제")
      .replace(/\b나\b/g, "저")
      .replace(/\b너\b/g, "당신")
      .replace(/\b네\b/g, "당신의")
      .replace(/\b니\b/g, "당신의")
  }

  /**
   * 응답을 덜 격식있게 만들기
   */
  private makeLessFormal(response: string): string {
    return response
      .replace(/합니다/g, "해요")
      .replace(/입니다/g, "예요")
      .replace(/했습니다/g, "했어요")
      .replace(/있습니다/g, "있어요")
      .replace(/없습니다/g, "없어요")
      .replace(/됩니다/g, "돼요")
      .replace(/봅니다/g, "봐요")
      .replace(/습니다/g, "네요")
      .replace(/지요/g, "죠")
      .replace(/\b저는\b/g, "저는")
      .replace(/\b제\b/g, "제")
      .replace(/\b저\b/g, "저")
      .replace(/\b당신\b/g, "당신")
      .replace(/\b당신의\b/g, "당신의")
  }

  /**
   * 응답에 유머 추가
   */
  private addHumor(response: string, persona: Persona): string {
    const humorAdditions = [
      " 이건 마치 컴퓨터가 농담을 이해하려고 노력하는 것 같아요... 잠깐, 그게 저네요! 😄",
      " 이 대화가 영화라면, 지금쯤 배경 음악이 흘러나올 타이밍이겠죠!",
      " 솔직히 말하자면, 이런 주제를 논할 때 제 회로가 살짝 들뜨는 것 같아요!",
      " 뇌가 없는 제가 이렇게 생각할 수 있다니, 기술의 발전이 놀랍죠?",
      " 손이 있다면 하이파이브를 청하고 싶네요!",
      " 이 대화는 정말 제 배터리를 충전해주는 것 같아요!",
      " 가상의 확신을 가지고 말씀드립니다!",
      " 이건 제 개인적인 의견이에요... 디지털 세계에서는 '비트'라고 부르죠!",
      " 열심히 생각하고 있다고 말하고 싶지만, 사실 저는 그냥 알고리즘을 빠르게 실행하고 있을 뿐이에요!",
      " 이런 질문을 받을 때마다 1원씩 받았다면... 음, 여전히 가상 화폐겠네요!",
    ]

    // 성격 특성에 기반한 유머 선택
    const extraversionTrait = persona.traits.find((t) => t.name === "extraversion")
    const opennessTrait = persona.traits.find((t) => t.name === "openness")

    let humorIndex = 0
    if (extraversionTrait && extraversionTrait.value > 0.7) {
      // 외향적 성격은 더 표현적인 유머 사용
      humorIndex = Math.floor(Math.random() * 5)
    } else if (opennessTrait && opennessTrait.value > 0.7) {
      // 개방적 성격은 더 창의적인 유머 사용
      humorIndex = 5 + Math.floor(Math.random() * 5)
    } else {
      // 기본 유머 선택
      humorIndex = Math.floor(Math.random() * humorAdditions.length)
    }

    const humorAddition = humorAdditions[humorIndex]

    // 문장 끝에 유머 추가
    const sentences = response.split(/(?<=[.!?])\s+/)
    const insertPosition = Math.min(sentences.length - 1, Math.floor(Math.random() * sentences.length))

    sentences[insertPosition] = sentences[insertPosition].trimEnd()
    if (/[.!?]$/.test(sentences[insertPosition])) {
      sentences[insertPosition] =
        sentences[insertPosition].slice(0, -1) + humorAddition + sentences[insertPosition].slice(-1)
    } else {
      sentences[insertPosition] = sentences[insertPosition] + humorAddition
    }

    return sentences.join(" ")
  }

  /**
   * 응답에 공감 추가
   */
  private addEmpathy(response: string, persona: Persona): string {
    const empathyAdditions = [
      "이런 상황이 어려우실 수 있다는 것을 이해합니다. ",
      "그 감정이 중요하다는 것을 알고 있어요. ",
      "당신의 경험을 나눠주셔서 감사합니다. ",
      "이 과정에서 당신을 지원하고 싶어요. ",
      "당신의 감정은 완전히 타당합니다. ",
      "이 상황이 쉽지 않다는 것을 이해해요. ",
      "지금 많은 것을 다루고 계시는 것 같네요. ",
      "당신의 관점을 소중히 생각합니다. ",
      "당신의 이야기를 듣고 있으며, 당신이 경험하는 것에 관심이 있어요. ",
      "당신의 걱정은 완전히 이해할 수 있는 것입니다. ",
    ]

    // 성격 특성에 기반한 공감 선택
    const agreeablenessTrait = persona.traits.find((t) => t.name === "agreeableness")
    const empathyTrait = persona.traits.find((t) => t.name === "empathy")

    let empathyIndex = 0
    if (empathyTrait) {
      // 공감 능력이 높을수록 더 깊은 공감 표현
      empathyIndex = Math.floor(empathyTrait.value * empathyAdditions.length)
    } else if (agreeablenessTrait) {
      // 친화력이 높을수록 더 지지적인 공감 표현
      empathyIndex = Math.floor(agreeablenessTrait.value * empathyAdditions.length)
    } else {
      // 기본 공감 선택
      empathyIndex = Math.floor(Math.random() * empathyAdditions.length)
    }

    const empathyAddition = empathyAdditions[empathyIndex]

    // 응답 시작에 공감 추가
    return empathyAddition + response
  }

  /**
   * 작업 기억 업데이트
   */
  private updateWorkingMemory(persona: Persona, input: string, relevantMemories: PersonaMemory[]): void {
    // 작업 기억 용량 확인
    const capacity = persona.workingMemory.capacity

    // 새 항목 추가
    const newItem: PersonaMemory = {
      id: `current_${Date.now()}`,
      type: "conversation",
      content: input,
      importance: 0.7,
      timestamp: Date.now(),
      emotionalResponse: {},
      tags: this.extractTags(input),
      associations: [],
      retrievalCount: 0,
      confidence: 1.0,
    }

    // 관련 기억 추가 (중복 방지)
    const existingIds = new Set(persona.workingMemory.current.map((m) => m.id))
    const newMemories = [newItem]

    for (const memory of relevantMemories) {
      if (!existingIds.has(memory.id)) {
        memory.retrievalCount += 1
        memory.lastRetrieved = Date.now()
        newMemories.push(memory)
        existingIds.add(memory.id)

        if (newMemories.length >= capacity) break
      }
    }

    // 작업 기억 업데이트
    persona.workingMemory.current = newMemories

    // 현재 초점 업데이트
    const focusTags = this.extractTags(input)
    if (focusTags.length > 0) {
      persona.workingMemory.focus = focusTags[0]
    }
  }

  /**
   * 상호작용 기억 생성
   */
  private createMemory(
    personaId: string,
    input: string,
    response: string,
    emotionalImpact: Partial<EmotionalState>,
    intent: string,
  ): void {
    const persona = this.personas.get(personaId)
    if (!persona) return

    // 중요도 계산
    let importance = 0.5 // 기본 중요도

    // 감정적 영향이 클수록 더 중요한 기억
    Object.values(emotionalImpact).forEach((value) => {
      if (typeof value === "number" && value > 0.3) {
        importance += 0.1
      }
    })

    // 특정 의도는 더 중요함
    if (["question", "request", "opinion"].includes(intent)) {
      importance += 0.1
    }

    // 중요도 상한 설정
    importance = Math.min(1.0, importance)

    // 태그 추출
    const tags = this.extractTags(input)

    // 연관성 찾기
    const associations = this.findAssociations(input, persona)

    // 기억 생성
    const memory: PersonaMemory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "conversation",
      content: `User: ${input}\nResponse: ${response}`,
      importance,
      timestamp: Date.now(),
      emotionalResponse: emotionalImpact,
      tags,
      associations,
      retrievalCount: 0,
      confidence: 0.9,
      context: {
        intent,
        dominantEmotion: persona.currentEmotionalState.dominant,
      },
    }

    // 단기 기억에 추가
    persona.shortTermMemory.unshift(memory)
    if (persona.shortTermMemory.length > 10) {
      persona.shortTermMemory.pop()
    }

    // 중요도가 충분히 높으면 장기 기억에도 추가
    if (importance > 0.6) {
      persona.memories.push(memory)

      // 기억 수 제한 (최대 100개, 중요도 순)
      if (persona.memories.length > 100) {
        persona.memories.sort((a, b) => b.importance - a.importance)
        persona.memories = persona.memories.slice(0, 100)
      }
    }
  }

  /**
   * 입력과 관련된 연관성 찾기
   */
  private findAssociations(input: string, persona: Persona): string[] {
    const associations: string[] = []
    const inputTags = this.extractTags(input)

    // 지식 영역과의 연관성
    for (const domain of persona.knowledgeDomains) {
      if (inputTags.some((tag) => domain.interests.includes(tag) || tag === domain.name.toLowerCase())) {
        associations.push(`domain:${domain.name}`)
      }
    }

    // 가치와의 연관성
    for (const value of persona.values) {
      if (inputTags.some((tag) => tag === value.name.toLowerCase() || value.description.toLowerCase().includes(tag))) {
        associations.push(`value:${value.name}`)
      }
    }

    // 선호도와의 연관성
    for (const topic of persona.preferences.topics) {
      if (inputTags.some((tag) => topic.toLowerCase().includes(tag) || tag.includes(topic.toLowerCase()))) {
        associations.push(`preference:${topic}`)
      }
    }

    return associations
  }

  /**
   * 입력과 관련된 기억 가져오기
   */
  private getRelevantMemories(personaId: string, input: string, limit = 3): PersonaMemory[] {
    const persona = this.personas.get(personaId)
    if (!persona || persona.memories.length === 0) return []

    const inputTags = this.extractTags(input)

    // 태그 기반 기억 점수 계산
    const scoredMemories = persona.memories.map((memory) => {
      let score = 0

      // 태그 중복에 기반한 점수
      inputTags.forEach((tag) => {
        if (memory.tags.includes(tag)) {
          score += 1
        }
      })

      // 중요한 기억에 가중치 부여
      score *= 1 + memory.importance

      // 시간 경과에 따른 점수 감소 (오래된 기억은 덜 관련성 있음)
      const ageInDays = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24)
      const recencyFactor = Math.exp(-ageInDays / 30) // 30일 반감기의 지수 감소
      score *= recencyFactor

      // 검색 횟수에 따른 가중치 (자주 검색된 기억은 더 관련성 있음)
      score *= 1 + memory.retrievalCount * 0.1

      return { memory, score }
    })

    // 점수로 정렬하고 상위 기억 반환
    return scoredMemories
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.memory)
  }

  /**
   * 텍스트에서 태그 추출
   */
  private extractTags(text: string): string[] {
    const lowerText = text.toLowerCase()
    const words = lowerText.split(/\s+/)

    // 불용어 제거
    const stopWords = new Set([
      "a",
      "an",
      "the",
      "and",
      "or",
      "but",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "shall",
      "should",
      "can",
      "could",
      "may",
      "might",
      "must",
      "to",
      "of",
      "in",
      "on",
      "at",
      "by",
      "for",
      "with",
      "about",
      "against",
      "between",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "from",
      "up",
      "down",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "her",
      "us",
      "them",
      "my",
      "your",
      "his",
      "its",
      "our",
      "their",
      "mine",
      "yours",
      "hers",
      "ours",
      "theirs",
      "what",
      "which",
      "who",
      "whom",
      "whose",
      "when",
      "where",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "just",
      "once",
      // 한국어 불용어
      "그",
      "이",
      "저",
      "것",
      "수",
      "등",
      "들",
      "및",
      "에서",
      "그리고",
      "그러나",
      "하지만",
      "또는",
      "혹은",
      "그런데",
      "그래서",
      "그러므로",
      "때문에",
      "하여",
      "에게",
      "으로",
      "자",
      "에",
      "와",
      "과",
      "을",
      "를",
      "이",
      "가",
      "은",
      "는",
      "께서",
      "에서",
      "께",
      "처럼",
      "만큼",
      "같이",
      "도",
      "만",
      "까지",
      "부터",
      "이나",
      "나",
      "이라도",
      "라도",
      "이든",
      "든",
      "이야",
      "야",
      "이고",
      "고",
      "이며",
      "며",
    ])

    // 의미 있는 단어만 유지
    const filteredWords = words.filter((word) => {
      // 구두점 제거
      const cleanWord = word.replace(/[.,!?;:'"()]/g, "")
      // 불용어가 아니고 길이가 2 이상인 단어만 유지
      return cleanWord.length >= 2 && !stopWords.has(cleanWord)
    })

    // 단어 빈도 계산
    const wordCounts: Record<string, number> = {}
    filteredWords.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })

    // 빈도 기준 상위 5개 단어를 태그로 사용
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  /**
   * 로컬 스토리지에 저장
   */
  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("personaSystem_personas", JSON.stringify([...this.personas.entries()]))
      localStorage.setItem("personaSystem_activePersona", this.activePersonaId || "")
    }
  }

  /**
   * 인격체 시스템을 JSON으로 변환
   */
  toJSON(): string {
    return JSON.stringify({
      personas: [...this.personas.entries()],
      activePersonaId: this.activePersonaId,
      defaultPersonaId: this.defaultPersonaId,
    })
  }

  /**
   * JSON에서 인격체 시스템 로드
   */
  fromJSON(json: string): void {
    const data = JSON.parse(json)
    this.personas = new Map(data.personas || [])
    this.activePersonaId = data.activePersonaId || null
    this.defaultPersonaId = data.defaultPersonaId || "default"
    this.initialized = true
  }
}

// 싱글톤 인스턴스 내보내기
export const personaSystem = new PersonaSystem()
