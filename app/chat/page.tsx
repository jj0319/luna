import AIChatWithSearch from "@/components/ai-chat-with-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleChatbot from "@/components/simple-chatbot"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Chat Interface</h1>

      <Tabs defaultValue="advanced" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="simple">Simple Chat</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Chat with Search</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="mt-0">
          <SimpleChatbot />
        </TabsContent>

        <TabsContent value="advanced" className="mt-0">
          <AIChatWithSearch />
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">About the Chat Interface</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Chat with local GPT-2 models</li>
              <li>Web search integration for up-to-date information</li>
              <li>Model selection to try different AI capabilities</li>
              <li>No API keys required for basic functionality</li>
              <li>All processing happens locally in your browser</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Limitations</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>GPT-2 is not designed as a chat model and may produce inconsistent responses</li>
              <li>Limited understanding of context in conversations</li>
              <li>May generate incorrect or outdated information</li>
              <li>Web search requires Google API configuration</li>
              <li>Local models have size limitations compared to cloud APIs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
