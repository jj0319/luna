import { type NextRequest, NextResponse } from "next/server"
import { oracleSearch } from "@/lib/oracle-search"

export async function POST(req: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await req.json()
    const { query, options = {} } = body

    if (!query) {
      return NextResponse.json({ error: "검색어가 제공되지 않았습니다." }, { status: 400 })
    }

    // 검색 모듈 초기화 확인
    if (!oracleSearch.isInitialized()) {
      await oracleSearch.initialize()
    }

    // 검색 수행
    const results = await oracleSearch.search(query, options)

    // 검색 결과 요약
    const summary = await oracleSearch.summarizeResults(results)

    // 검색 결과에서 정보 추출
    const extractedInfo = oracleSearch.extractInformation(results, query)

    return NextResponse.json({
      query,
      results,
      summary,
      extractedInfo,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("검색 API 오류:", error)
    return NextResponse.json({ error: "검색 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
