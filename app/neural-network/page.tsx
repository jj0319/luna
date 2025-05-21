"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NeuralNetwork } from "@/lib/neural-network"
import { plotErrors } from "@/lib/visualization"

export default function NeuralNetworkPage() {
  const [activeTab, setActiveTab] = useState("xor")
  const [xorNetwork, setXorNetwork] = useState<NeuralNetwork | null>(null)
  const [xorTraining, setXorTraining] = useState(false)
  const [xorErrors, setXorErrors] = useState<number[]>([])
  const [xorResults, setXorResults] = useState<{ input: number[]; expected: number; output: number }[]>([])

  const [digitNetwork, setDigitNetwork] = useState<NeuralNetwork | null>(null)
  const [digitTraining, setDigitTraining] = useState(false)
  const [digitErrors, setDigitErrors] = useState<number[]>([])
  const [digitResults, setDigitResults] = useState<{ digit: number; predicted: number; confidence: number }[]>([])

  // XOR dataset
  const xorDataset: [number[], number[]][] = [
    [[0, 0], [0]],
    [[0, 1], [1]],
    [[1, 0], [1]],
    [[1, 1], [0]],
  ]

  // Digit dataset
  const digitData = {
    0: [1, 1, 1, 1, 0, 1, 1, 1, 1],
    1: [0, 1, 0, 0, 1, 0, 0, 1, 0],
    2: [1, 1, 1, 0, 1, 0, 1, 1, 1],
    3: [1, 1, 1, 0, 1, 1, 1, 1, 1],
    4: [1, 0, 1, 1, 1, 1, 0, 0, 1],
    5: [1, 1, 1, 1, 1, 0, 1, 1, 1],
    6: [1, 0, 0, 1, 1, 1, 1, 1, 1],
    7: [1, 1, 1, 0, 0, 1, 0, 0, 1],
    8: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    9: [1, 1, 1, 1, 1, 1, 0, 0, 1],
  }

  // Create one-hot encoded outputs for each digit
  function oneHotEncode(digit: number): number[] {
    const encoded = new Array(10).fill(0)
    encoded[digit] = 1
    return encoded
  }

  // Create digit dataset
  const digitDataset: [number[], number[]][] = []
  for (let digit = 0; digit <= 9; digit++) {
    digitDataset.push([digitData[digit], oneHotEncode(digit)])
  }

  // Initialize networks
  useEffect(() => {
    setXorNetwork(new NeuralNetwork([2, 4, 1], "sigmoid", 0.1))
    setDigitNetwork(new NeuralNetwork([9, 15, 10], "sigmoid", 0.1))
  }, [])

  // Train XOR network
  const trainXOR = async () => {
    if (!xorNetwork || xorTraining) return

    setXorTraining(true)
    setXorErrors([])

    // Train in chunks to keep UI responsive
    const epochs = 1000
    const chunkSize = 100
    const errors: number[] = []

    for (let i = 0; i < epochs; i += chunkSize) {
      // Allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 0))

      const chunkErrors = xorNetwork.trainBatch(xorDataset, chunkSize, 0, true)
      errors.push(...chunkErrors)
      setXorErrors([...errors])
    }

    // Test the network
    const results = xorDataset.map(([input, expected]) => {
      const output = xorNetwork!.predict(input)[0]
      return { input, expected: expected[0], output }
    })

    setXorResults(results)
    setXorTraining(false)
  }

  // Train digit recognition network
  const trainDigitRecognition = async () => {
    if (!digitNetwork || digitTraining) return

    setDigitTraining(true)
    setDigitErrors([])

    // Train in chunks to keep UI responsive
    const epochs = 1000
    const chunkSize = 100
    const errors: number[] = []

    for (let i = 0; i < epochs; i += chunkSize) {
      // Allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 0))

      const chunkErrors = digitNetwork.trainBatch(digitDataset, chunkSize, 0, true)
      errors.push(...chunkErrors)
      setDigitErrors([...errors])
    }

    // Test the network
    const results = []
    for (let digit = 0; digit <= 9; digit++) {
      const output = digitNetwork.predict(digitData[digit])
      const predictedDigit = output.indexOf(Math.max(...output))
      results.push({
        digit,
        predicted: predictedDigit,
        confidence: output[predictedDigit],
      })
    }

    setDigitResults(results)
    setDigitTraining(false)
  }

  // Render 3x3 grid for digit visualization
  const renderDigitGrid = (digit: number) => {
    const pixels = digitData[digit]

    return (
      <div className="grid grid-cols-3 gap-1 w-16 h-16">
        {pixels.map((pixel, i) => (
          <div key={i} className={`w-5 h-5 ${pixel ? "bg-primary" : "bg-gray-200"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Neural Network Playground</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="xor">XOR Problem</TabsTrigger>
          <TabsTrigger value="digits">Digit Recognition</TabsTrigger>
        </TabsList>

        <TabsContent value="xor">
          <Card>
            <CardHeader>
              <CardTitle>XOR Neural Network</CardTitle>
              <CardDescription>
                Training a neural network to solve the XOR problem, which requires a hidden layer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Network Architecture</h3>
                  <p className="mb-4">2 inputs → 4 hidden neurons → 1 output</p>

                  <Button onClick={trainXOR} disabled={xorTraining} className="mb-4">
                    {xorTraining ? "Training..." : "Train Network"}
                  </Button>

                  {xorErrors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Training Error</h3>
                      <p className="mb-2">Final error: {xorErrors[xorErrors.length - 1].toFixed(6)}</p>
                      <div className="font-mono text-xs whitespace-pre overflow-x-auto bg-gray-100 p-2 rounded">
                        {plotErrors(xorErrors)}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Test Results</h3>
                  {xorResults.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2">Input</th>
                          <th className="border p-2">Expected</th>
                          <th className="border p-2">Output</th>
                          <th className="border p-2">Correct</th>
                        </tr>
                      </thead>
                      <tbody>
                        {xorResults.map((result, i) => {
                          const isCorrect = Math.round(result.output) === result.expected
                          return (
                            <tr key={i}>
                              <td className="border p-2">[{result.input.join(", ")}]</td>
                              <td className="border p-2">{result.expected}</td>
                              <td className="border p-2">{result.output.toFixed(4)}</td>
                              <td className={`border p-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                                {isCorrect ? "✓" : "✗"}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p>Train the network to see results</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="digits">
          <Card>
            <CardHeader>
              <CardTitle>Digit Recognition</CardTitle>
              <CardDescription>
                Training a neural network to recognize handwritten digits (simplified 3x3 pixel representation).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Network Architecture</h3>
                  <p className="mb-4">9 inputs (3x3 pixels) → 15 hidden neurons → 10 outputs (digits 0-9)</p>

                  <Button onClick={trainDigitRecognition} disabled={digitTraining} className="mb-4">
                    {digitTraining ? "Training..." : "Train Network"}
                  </Button>

                  {digitErrors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Training Error</h3>
                      <p className="mb-2">Final error: {digitErrors[digitErrors.length - 1].toFixed(6)}</p>
                      <div className="font-mono text-xs whitespace-pre overflow-x-auto bg-gray-100 p-2 rounded">
                        {plotErrors(digitErrors)}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Test Results</h3>
                  {digitResults.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {digitResults.map((result) => {
                        const isCorrect = result.predicted === result.digit
                        return (
                          <div key={result.digit} className="flex items-center space-x-4 border p-2 rounded">
                            <div>{renderDigitGrid(result.digit)}</div>
                            <div>
                              <p>Digit: {result.digit}</p>
                              <p>Predicted: {result.predicted}</p>
                              <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                              <p className={isCorrect ? "text-green-500" : "text-red-500"}>
                                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p>Train the network to see results</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
