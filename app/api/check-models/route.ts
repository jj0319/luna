import { NextResponse } from "next/server"
import { getAvailableLocalModels, LOCAL_MODELS } from "@/lib/local-ai"

export async function GET() {
  try {
    // Get available models
    const availableModels = getAvailableLocalModels()

    // Create a status object for each model
    const modelStatus: Record<string, boolean> = {}

    // Check each model in LOCAL_MODELS
    Object.values(LOCAL_MODELS).forEach((modelName) => {
      modelStatus[modelName] = availableModels.includes(modelName)
    })

    return NextResponse.json({
      models: modelStatus,
      availableModels,
    })
  } catch (error) {
    console.error("Error checking models:", error)
    return NextResponse.json(
      {
        error: "Failed to check models",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
