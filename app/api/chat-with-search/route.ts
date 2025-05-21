import { type NextRequest, NextResponse } from "next/server"

// Define the ChatRequest type
interface ChatRequest {
  messages: { role: string; content: string }[]
  modelId?: string
}

// Mock response function to avoid onnxruntime-web issues
function mockResponse(prompt: string): string {
  const responses = [
    "I understand your question. Based on the information available, I would suggest looking into this further.",
    "That's an interesting point. There are several perspectives to consider here.",
    "I've analyzed your query and found some relevant information that might help.",
    "Based on my understanding, there are multiple factors that contribute to this situation.",
    "I appreciate your question. Let me provide some insights based on what I know.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { messages, modelId = "gpt2-medium" } = (await req.json()) as ChatRequest

    // Extract the model name from the modelId
    const modelName = modelId.replace("huggingface-", "").replace("local-", "")

    // Extract search results from system messages if present
    const searchResultMessage = messages.find(
      (message) => message.role === "system" && message.content.includes("web search"),
    )
    const searchResults = searchResultMessage ? searchResultMessage.content : null

    // Filter out system messages with search results
    const userMessages = messages.filter(
      (message) => !(message.role === "system" && message.content.includes("web search")),
    )

    // Get the last user message
    const lastUserMessage = userMessages.filter((message) => message.role === "user").pop()?.content || ""

    // Create a streaming response with mock data to avoid onnxruntime-web issues
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate a response based on the last user message
          const response = mockResponse(lastUserMessage)

          // Send the response in chunks to simulate streaming
          const chunks = response.split(" ")
          for (const chunk of chunks) {
            const event = {
              type: "text",
              value: chunk + " ",
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
            await new Promise((resolve) => setTimeout(resolve, 100))
          }

          controller.close()
        } catch (error) {
          console.error("Error generating response:", error)
          const errorEvent = {
            type: "error",
            value: "Failed to generate response",
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    // Handle errors
    console.error("Error in chat API:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
