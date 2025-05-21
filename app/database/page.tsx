import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"

export const metadata: Metadata = {
  title: "데이터베이스",
  description: "AI 응답 데이터베이스 관리 및 분석",
}

// 샘플 데이터
const data = [
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

export default function DatabasePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">데이터베이스 관리</h1>

      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="responses">응답 데이터</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI 응답 데이터베이스</CardTitle>
              <CardDescription>
                AI 모델이 생성한 모든 응답의 기록입니다. 질문, 응답, 사용된 모델 등의 정보를 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>응답 분석</CardTitle>
              <CardDescription>AI 응답 데이터에 대한 분석 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">모델별 응답 수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                      모델별 응답 수 차트가 여기에 표시됩니다.
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">카테고리별 응답 수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                      카테고리별 응답 수 차트가 여기에 표시됩니다.
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">피드백 분포</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                      피드백 분포 차트가 여기에 표시됩니다.
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">시간별 응답 수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                      시간별 응답 수 차트가 여기에 표시됩니다.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>데이터베이스 설정</CardTitle>
              <CardDescription>데이터베이스 관련 설정을 변경할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">데이터 보존 기간</h3>
                  <p className="text-sm text-muted-foreground">데이터를 보존할 기간을 설정합니다.</p>
                  <select className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="30">30일</option>
                    <option value="60">60일</option>
                    <option value="90">90일</option>
                    <option value="180">180일</option>
                    <option value="365">1년</option>
                    <option value="0">무제한</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-medium">자동 백업</h3>
                  <p className="text-sm text-muted-foreground">데이터베이스 자동 백업 설정</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" id="auto-backup" className="rounded border-gray-300" />
                    <label htmlFor="auto-backup">자동 백업 활성화</label>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">데이터 내보내기</h3>
                  <p className="text-sm text-muted-foreground">데이터베이스 내용을 파일로 내보냅니다.</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      CSV로 내보내기
                    </button>
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      JSON으로 내보내기
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
