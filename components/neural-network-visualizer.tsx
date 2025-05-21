"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, BarChart, RefreshCw } from "lucide-react"
import { trainNeuralNetworks, getNeuralLearningStats } from "@/lib/neural-learning-store"

export default function NeuralNetworkVisualizer() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get neural network stats
  useEffect(() => {
    const fetchStats = () => {
      try {
        const neuralStats = getNeuralLearningStats()
        setStats(neuralStats)
      } catch (err) {
        console.error("Error fetching neural stats:", err)
        setError("Failed to load neural network statistics")
      }
    }

    fetchStats()

    // Update stats every 10 seconds
    const interval = setInterval(fetchStats, 10000)

    return () => clearInterval(interval)
  }, [])

  // Draw neural network visualization
  useEffect(() => {
    if (!canvasRef.current || !stats?.neuralNetworks?.responseQuality) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Parse architecture
    const architecture = stats.neuralNetworks.responseQuality.architecture.split("-").map(Number)

    // Draw neural network
    drawNeuralNetwork(ctx, architecture, canvas.width, canvas.height)
  }, [stats])

  // Draw neural network visualization
  const drawNeuralNetwork = (ctx: CanvasRenderingContext2D, architecture: number[], width: number, height: number) => {
    const padding = 30
    const layerWidth = (width - padding * 2) / (architecture.length - 1)
    const maxNeurons = Math.max(...architecture)

    // Draw connections first (so they appear behind neurons)
    ctx.strokeStyle = "rgba(100, 100, 255, 0.2)"

    for (let layer = 0; layer < architecture.length - 1; layer++) {
      const startX = padding + layer * layerWidth
      const endX = padding + (layer + 1) * layerWidth

      for (let neuron1 = 0; neuron1 < architecture[layer]; neuron1++) {
        const neuronHeight1 = height / (architecture[layer] + 1)
        const y1 = neuronHeight1 * (neuron1 + 1)

        for (let neuron2 = 0; neuron2 < architecture[layer + 1]; neuron2++) {
          const neuronHeight2 = height / (architecture[layer + 1] + 1)
          const y2 = neuronHeight2 * (neuron2 + 1)

          ctx.beginPath()
          ctx.moveTo(startX, y1)
          ctx.lineTo(endX, y2)
          ctx.stroke()
        }
      }
    }

    // Draw neurons
    for (let layer = 0; layer < architecture.length; layer++) {
      const x = padding + layer * layerWidth

      for (let neuron = 0; neuron < architecture[layer]; neuron++) {
        const neuronHeight = height / (architecture[layer] + 1)
        const y = neuronHeight * (neuron + 1)

        // Draw neuron
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)

        // Color based on layer
        if (layer === 0) {
          ctx.fillStyle = "rgba(75, 192, 192, 0.8)" // Input layer
        } else if (layer === architecture.length - 1) {
          ctx.fillStyle = "rgba(255, 99, 132, 0.8)" // Output layer
        } else {
          ctx.fillStyle = "rgba(54, 162, 235, 0.8)" // Hidden layers
        }

        ctx.fill()
        ctx.stroke()
      }
    }

    // Add labels
    ctx.fillStyle = "black"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // Layer labels
    ctx.fillText("Input", padding, height - 10)
    ctx.fillText("Output", padding + (architecture.length - 1) * layerWidth, height - 10)

    // Hidden layer labels
    for (let layer = 1; layer < architecture.length - 1; layer++) {
      ctx.fillText(`Hidden ${layer}`, padding + layer * layerWidth, height - 10)
    }
  }

  // Train neural networks
  const handleTrainNetworks = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    setError(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => {
          const newProgress = prev + Math.random() * 5
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 100)

      // Train networks
      const result = await trainNeuralNetworks()

      clearInterval(progressInterval)
      setTrainingProgress(100)

      // Update stats
      setStats(getNeuralLearningStats())

      // Reset progress after a delay
      setTimeout(() => {
        setIsTraining(false)
        setTrainingProgress(0)
      }, 1000)
    } catch (err) {
      setError("Failed to train neural networks")
      setIsTraining(false)
      console.error("Training error:", err)
    }
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Neural Network Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Neural Network Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Response Quality Network</h3>
            {stats.neuralNetworks.responseQuality ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Architecture: {stats.neuralNetworks.responseQuality.architecture}
                </div>
                <div className="text-sm text-muted-foreground">
                  Training Examples: {stats.neuralNetworks.responseQuality.trainingExamples}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Not initialized</div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Content Category Network</h3>
            {stats.neuralNetworks.contentCategory ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Architecture: {stats.neuralNetworks.contentCategory.architecture}
                </div>
                <div className="text-sm text-muted-foreground">
                  Training Examples: {stats.neuralNetworks.contentCategory.trainingExamples}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Not initialized</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Text Embedder</h3>
          {stats.neuralNetworks.textEmbedder ? (
            <div className="text-sm text-muted-foreground">
              Vocabulary Size: {stats.neuralNetworks.textEmbedder.vocabularySize} words
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Not initialized</div>
          )}
        </div>

        <div className="border rounded-md p-2">
          <h3 className="text-sm font-medium mb-2">Network Visualization</h3>
          <canvas ref={canvasRef} width={400} height={200} className="w-full h-[200px] bg-gray-50 rounded-md" />
        </div>

        {isTraining && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training Progress</span>
              <span>{Math.round(trainingProgress)}%</span>
            </div>
            <Progress value={trainingProgress} className="h-2" />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center">
              <BarChart className="h-3 w-3 mr-1" />
              {stats.totalInteractions} Interactions
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Brain className="h-3 w-3 mr-1" />
              {stats.knowledgeItems} Knowledge Items
            </Badge>
          </div>

          <Button
            onClick={handleTrainNetworks}
            disabled={isTraining || !stats.neuralNetworks.responseQuality}
            size="sm"
          >
            {isTraining ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Train Networks
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
