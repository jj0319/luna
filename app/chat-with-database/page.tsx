import type { Metadata } from "next"
import AIChatWithDatabase from "@/components/ai-chat-with-database"

export const metadata: Metadata = {
  title: "데이터베이스 통합 챗봇",
  description: "응답을 데이터베이스에 저장하는 AI 챗봇",
}

export default function ChatWithDatabasePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">데이터베이스 통합 챗봇</h1>
      <p className="text-muted-foreground mb-8">
        이 챗봇은 모든 대화 내용을 데이터베이스에 저장하고, 유사한 질문에 대한 이전 응답을 활용합니다. 피드백을 제공하여
        응답 품질을 향상시킬 수 있습니다.
      </p>

      <AIChatWithDatabase />

      <div className="mt-8 text-sm text-muted-foreground">
        <h2 className="text-lg font-medium mb-2">데이터베이스 통합 기능</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>모든 질문과 응답이 로컬 데이터베이스에 저장됩니다</li>
          <li>유사한 질문에 대한 이전 응답을 검색하여 활용합니다</li>
          <li>피드백을 통해 응답 품질을 평가하고 개선합니다</li>
          <li>데이터베이스 대시보드에서 모든 응답 데이터를 관리하고 분석할 수 있습니다</li>
        </ul>
      </div>
    </div>
  )
}
