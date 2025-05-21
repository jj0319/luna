import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if API key and search engine ID are set
    const apiKeySet = !!process.env.GOOGLE_API_KEY
    const idSet = !!process.env.GOOGLE_ID

    // Return diagnostic information
    return NextResponse.json({
      status: "success",
      diagnostics: {
        apiKeySet,
        idSet,
        apiKeyLength: apiKeySet ? process.env.GOOGLE_API_KEY!.length : 0,
        idLength: idSet ? process.env.GOOGLE_ID!.length : 0,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)

    return NextResponse.json(
      {
        status: "error",
        error: "진단 정보를 가져오는 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
