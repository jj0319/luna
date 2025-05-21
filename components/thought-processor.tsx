"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { nlu, type NLUResult } from "@/lib/natural-language-understanding"
import { Info, Brain, Code, Cpu } from "lucide-react"

export default function ThoughtProcessor() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<NLUResult | null>(null)
  const [jsonOutput, setJsonOutput] = useState("")
  const [machineCode, setMachineCode] = useState("")

  // Process the input text using NLU
  const processThought = () => {
    if (!input.trim()) return

    // Use the NLU module to analyze the text
    const nluResult = nlu.analyze(input)
    setResult(nluResult)

    // Convert to JSON representation
    setJsonOutput(JSON.stringify(nluResult, null, 2))

    // Generate pseudo-machine code representation
    generateMachineCode(nluResult)
  }

  // Generate a pseudo-machine code representation
  const generateMachineCode = (nluResult: NLUResult) => {
    // This is a simplified representation, not actual machine code
    let code = "; Processed thought in pseudo-assembly\n"
    code += "; Intent detection and processing\n\n"

    code += `LOAD_INTENT "${nluResult.intent}"\n`
    code += `SET_CONFIDENCE ${nluResult.confidence.toFixed(2)}\n\n`

    if (nluResult.entities.length > 0) {
      code += "; Entity extraction\n"
      nluResult.entities.forEach((entity, i) => {
        code += `STORE_ENTITY ${i} "${entity.name}" "${entity.type}"\n`
      })
      code += "\n"
    }

    code += "; Sentiment analysis\n"
    code += `SET_SENTIMENT ${nluResult.sentiment.score.toFixed(2)}\n`
    code += `SET_MAGNITUDE ${nluResult.sentiment.magnitude.toFixed(2)}\n\n`

    if (nluResult.topics.length > 0) {
      code += "; Topic identification\n"
      nluResult.topics.forEach((topic, i) => {
        code += `REGISTER_TOPIC ${i} "${topic}"\n`
      })
      code += "\n"
    }

    code += "; Language and complexity\n"
    code += `SET_LANGUAGE "${nluResult.language}"\n`
    code += `SET_COMPLEXITY ${nluResult.complexity.toFixed(2)}\n\n`

    code += "PROCESS_INPUT\nRETURN_RESULT"

    setMachineCode(code)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Thought Processor
        </CardTitle>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This tool processes natural language into machine-readable formats using NLU techniques.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label htmlFor="thought-input" className="text-sm font-medium block mb-2">
            Enter your thought:
          </label>
          <Textarea
            id="thought-input"
            placeholder="Type your thought here... (e.g., 'I'm excited about the new AI developments in healthcare')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {result && (
          <Tabs defaultValue="structured">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="structured">
                <Code className="h-4 w-4 mr-2" />
                JSON Structure
              </TabsTrigger>
              <TabsTrigger value="machine">
                <Cpu className="h-4 w-4 mr-2" />
                Machine Code
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Brain className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structured" className="mt-0">
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                <pre className="text-xs">{jsonOutput}</pre>
              </div>
            </TabsContent>

            <TabsContent value="machine" className="mt-0">
              <div className="bg-black text-green-400 p-4 rounded-md font-mono text-xs overflow-auto max-h-[300px]">
                <pre>{machineCode}</pre>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Intent</h3>
                    <p className="text-sm">
                      {result.intent} ({(result.confidence * 100).toFixed(0)}%)
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Sentiment</h3>
                    <p className="text-sm">
                      {result.sentiment.score > 0.2
                        ? "Positive"
                        : result.sentiment.score < -0.2
                          ? "Negative"
                          : "Neutral"}
                      ({result.sentiment.score.toFixed(2)})
                    </p>
                  </div>
                </div>

                {result.entities.length > 0 && (
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Entities</h3>
                    <ul className="text-sm space-y-1">
                      {result.entities.map((entity, i) => (
                        <li key={i}>
                          <span className="font-medium">{entity.name}</span> ({entity.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.topics.length > 0 && (
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.topics.map((topic, i) => (
                        <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Language</h3>
                    <p className="text-sm capitalize">{result.language}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Complexity</h3>
                    <p className="text-sm">
                      {result.complexity < 0.3 ? "Simple" : result.complexity < 0.7 ? "Moderate" : "Complex"}(
                      {(result.complexity * 100).toFixed(0)}%)
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={processThought} className="w-full">
          Process Thought
        </Button>
      </CardFooter>
    </Card>
  )
}
