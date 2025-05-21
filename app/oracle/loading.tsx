import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">ORACLE</h1>
          <p className="text-xl text-muted-foreground">Omniscient Reasoning And Cognitive Learning Engine</p>
        </div>

        <div className="flex justify-center items-center h-[600px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-bold">시스템 로딩 중...</h2>
            <p className="text-muted-foreground">ORACLE 시스템을 초기화하고 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
