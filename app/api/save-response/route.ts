import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, model } = body

    if (!question || !answer || !model) {
      return NextResponse.json({ error: "질문, 응답, 모델은 필수 항목입니다." }, { status: 400 })
    }

    // 여기서 실제로는 데이터베이스에 저장
    // 이 예제에서는 /api/database 엔드포인트로 요청을 전달

    const dbResponse = await fetch(new URL("/api/database", request.url).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!dbResponse.ok) {
      throw new Error("데이터베이스 저장 실패")
    }

    const savedResponse = await dbResponse.json()

    return NextResponse.json(savedResponse, { status: 201 })
  } catch (error) {
    console.error("응답 저장 중 오류:", error)
    return NextResponse.json({ error: "응답을 저장하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}
