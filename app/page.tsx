import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Luna</h1>
        <p className="text-xl text-muted-foreground mb-8">개인용 AI 연구 및 검색 플랫폼</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/chat">AI 채팅 시작하기</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">검색 시작하기</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>웹 검색</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Google API를 활용한 강력한 웹 검색 기능을 제공합니다.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/search">검색하기</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI 채팅</CardTitle>
            </CardHeader>
            <CardContent>
              <p>GPT-2 기반 AI 모델과 대화하고 질문에 답변을 받을 수 있습니다.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/chat">채팅하기</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>신경망 학습</CardTitle>
            </CardHeader>
            <CardContent>
              <p>자가 학습 신경망을 통해 AI 모델을 개선하고 학습시킬 수 있습니다.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/neural-network">신경망 보기</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>데이터베이스</CardTitle>
            </CardHeader>
            <CardContent>
              <p>검색 결과와 대화 내용을 저장하고 관리할 수 있습니다.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/database">데이터 관리</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
