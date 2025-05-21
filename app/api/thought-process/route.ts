import { type NextRequest, NextResponse } from "next/server"
import { nlu } from "@/lib/natural-language-understanding"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input. Please provide a text string." }, { status: 400 })
    }

    // Process the text using the NLU module
    const result = nlu.analyze(text)

    // Generate pseudo-machine code
    const machineCode = generateMachineCode(result)

    return NextResponse.json({
      analysis: result,
      machineCode,
      json: JSON.stringify(result, null, 2),
    })
  } catch (error) {
    console.error("Error processing thought:", error)
    return NextResponse.json({ error: "Failed to process the thought." }, { status: 500 })
  }
}

function generateMachineCode(result: any) {
  // This is a simplified representation, not actual machine code
  let code = "; Processed thought in pseudo-assembly\n"
  code += "; Intent detection and processing\n\n"

  code += `LOAD_INTENT "${result.intent}"\n`
  code += `SET_CONFIDENCE ${result.confidence.toFixed(2)}\n\n`

  if (result.entities.length > 0) {
    code += "; Entity extraction\n"
    result.entities.forEach((entity: any, i: number) => {
      code += `STORE_ENTITY ${i} "${entity.name}" "${entity.type}"\n`
    })
    code += "\n"
  }

  code += "; Sentiment analysis\n"
  code += `SET_SENTIMENT ${result.sentiment.score.toFixed(2)}\n`
  code += `SET_MAGNITUDE ${result.sentiment.magnitude.toFixed(2)}\n\n`

  if (result.topics.length > 0) {
    code += "; Topic identification\n"
    result.topics.forEach((topic: string, i: number) => {
      code += `REGISTER_TOPIC ${i} "${topic}"\n`
    })
    code += "\n"
  }

  code += "; Language and complexity\n"
  code += `SET_LANGUAGE "${result.language}"\n`
  code += `SET_COMPLEXITY ${result.complexity.toFixed(2)}\n\n`

  code += "PROCESS_INPUT\nRETURN_RESULT"

  return code
}
