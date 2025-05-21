import SimpleChatWithSearch from "@/components/simple-chat-with-search"

export default function SimpleChatPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Assistant with Search</h1>
      <SimpleChatWithSearch />
    </div>
  )
}
