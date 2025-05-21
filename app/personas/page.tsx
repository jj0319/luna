import { PersonaSelector } from "@/components/persona-selector"
import { PersonaChat } from "@/components/persona-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResetPersonaButton } from "@/components/reset-persona-button"

export default function PersonasPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI 인격체</h1>
        <p className="text-muted-foreground">독특한 성격, 감정, 대화 스타일을 가진 AI 인격체와 상호작용하세요</p>
        <div className="flex justify-center mt-4">
          <ResetPersonaButton />
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="chat">채팅</TabsTrigger>
          <TabsTrigger value="personas">인격체 선택</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <PersonaChat />
        </TabsContent>

        <TabsContent value="personas" className="mt-6">
          <PersonaSelector />
        </TabsContent>
      </Tabs>
    </div>
  )
}
