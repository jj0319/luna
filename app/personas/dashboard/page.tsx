import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PersonaSelector } from "@/components/persona-selector"

export default function PersonaDashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI 인격체 대시보드</h1>
        <p className="text-muted-foreground">인격체 시스템을 관리하고 모니터링하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>인격체 관리</CardTitle>
            <CardDescription>AI 인격체를 생성하고 관리합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/personas">인격체 선택</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/personas/create">새 인격체 생성</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>감정 시스템</CardTitle>
            <CardDescription>인격체의 감정 상태를 모니터링합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/personas/emotions">감정 시각화</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/personas/chat">감정 테스트</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>대화 시스템</CardTitle>
            <CardDescription>인격체와 대화하고 상호작용합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/personas/chat">인격체 채팅</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/chat">통합 채팅</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>현재 인격체</CardTitle>
            <CardDescription>현재 활성화된 인격체를 확인하고 변경합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <PersonaSelector />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
