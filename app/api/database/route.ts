import { type NextRequest, NextResponse } from "next/server"
import type { Response } from "@/lib/database"

// 메모리 내 데이터베이스 (서버 재시작 시 초기화됨)
// 실제 프로덕션에서는 영구 데이터베이스를 사용해야 함
let responses: Response[] = [
  {
    id: "1",
    question: "인공지능이란 무엇인가요?",
    answer: "인공지능(AI)은 인간의 학습, 추론, 인식, 문제 해결 능력 등을 컴퓨터 시스템으로 구현한 기술입니다.",
    model: "GPT-2",
    timestamp: "2023-05-15T14:30:00",
    category: "일반",
    feedback: "좋음",
  },
  {
    id: "2",
    question: "머신러닝과 딥러닝의 차이점은 무엇인가요?",
    answer:
      "머신러닝은 데이터를 기반으로 패턴을 학습하는 AI의 한 분야이며, 딥러닝은 머신러닝의 하위 분야로 인간 뇌의 신경망 구조를 모방한 인공 신경망을 사용합니다.",
    model: "GPT-2-Medium",
    timestamp: "2023-05-16T10:15:00",
    category: "기술",
    feedback: "매우 좋음",
  },
  {
    id: "3",
    question: "자연어 처리란 무엇인가요?",
    answer: "자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리할 수 있게 하는 인공지능의 한 분야입니다.",
    model: "GPT-2-Large",
    timestamp: "2023-05-17T09:45:00",
    category: "기술",
    feedback: "보통",
  },
  {
    id: "4",
    question: "강화학습이란 무엇인가요?",
    answer:
      "강화학습은 에이전트가 환경과 상호작용하며 보상을 최대화하는 방향으로 행동을 학습하는 머신러닝의 한 종류입니다.",
    model: "GPT-2",
    timestamp: "2023-05-18T16:20:00",
    category: "기술",
    feedback: "좋음",
  },
  {
    id: "5",
    question: "컴퓨터 비전이란 무엇인가요?",
    answer: "컴퓨터 비전은 컴퓨터가 디지털 이미지나 비디오를 이해하고 처리할 수 있게 하는 인공지능의 한 분야입니다.",
    model: "GPT-2-Medium",
    timestamp: "2023-05-19T11:30:00",
    category: "기술",
    feedback: "매우 좋음",
  },
]

// 모든 응답 가져오기
export async function GET(request: NextRequest) {
  return NextResponse.json(responses)
}

// 새 응답 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, model, category = "일반", feedback = "없음" } = body

    if (!question || !answer || !model) {
      return NextResponse.json({ error: "질문, 응답, 모델은 필수 항목입니다." }, { status: 400 })
    }

    const newResponse: Response = {
      id: crypto.randomUUID(),
      question,
      answer,
      model,
      timestamp: new Date().toISOString(),
      category,
      feedback,
    }

    responses.push(newResponse)

    return NextResponse.json(newResponse, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "응답을 추가하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 응답 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID는 필수 항목입니다." }, { status: 400 })
    }

    const index = responses.findIndex((response) => response.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "해당 ID의 응답을 찾을 수 없습니다." }, { status: 404 })
    }

    responses[index] = { ...responses[index], ...updateData }

    return NextResponse.json(responses[index])
  } catch (error) {
    return NextResponse.json({ error: "응답을 업데이트하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 응답 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID는 필수 항목입니다." }, { status: 400 })
    }

    const initialLength = responses.length
    responses = responses.filter((response) => response.id !== id)

    if (responses.length === initialLength) {
      return NextResponse.json({ error: "해당 ID의 응답을 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "응답을 삭제하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}
