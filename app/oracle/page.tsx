import { OracleInterface } from "@/components/oracle-interface"

export default function OraclePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">ORACLE</h1>
          <p className="text-xl text-muted-foreground">Omniscient Reasoning And Cognitive Learning Engine</p>
          <p className="mt-2 text-muted-foreground">다양한 AI 기술을 통합한 고급 인지 시스템</p>
        </div>

        <OracleInterface />
      </div>
    </div>
  )
}
