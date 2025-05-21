"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonaSystem, type EmotionalState } from "@/lib/persona-system"

interface EmotionVisualizerProps {
  personaId?: string
  emotionalState?: EmotionalState
  showTitle?: boolean
}

export function PersonaEmotionVisualizer({
  personaId,
  emotionalState: propEmotionalState,
  showTitle = true,
}: EmotionVisualizerProps) {
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(propEmotionalState || null)
  const [isLoading, setIsLoading] = useState(!propEmotionalState)

  useEffect(() => {
    if (propEmotionalState) {
      setEmotionalState(propEmotionalState)
      setIsLoading(false)
      return
    }

    if (personaId) {
      const loadPersonaEmotion = async () => {
        try {
          const personaSystem = new PersonaSystem()
          await personaSystem.initialize()

          const persona = personaSystem.getPersona(personaId)
          if (persona) {
            setEmotionalState(persona.currentEmotionalState)
          }

          setIsLoading(false)
        } catch (error) {
          console.error("Failed to load persona emotion:", error)
          setIsLoading(false)
        }
      }

      loadPersonaEmotion()
    }
  }, [personaId, propEmotionalState])

  if (isLoading || !emotionalState) {
    return (
      <Card>
        <CardHeader>{showTitle && <CardTitle>Emotional State</CardTitle>}</CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filter out the dominant property for visualization
  const emotions = Object.entries(emotionalState)
    .filter(([key]) => key !== "dominant")
    .sort((a, b) => (b[1] as number) - (a[1] as number))

  const getEmotionColor = (emotion: string): string => {
    switch (emotion) {
      case "joy":
        return "bg-green-500"
      case "sadness":
        return "bg-blue-500"
      case "anger":
        return "bg-red-500"
      case "fear":
        return "bg-purple-500"
      case "surprise":
        return "bg-yellow-500"
      case "disgust":
        return "bg-orange-500"
      case "trust":
        return "bg-teal-500"
      case "anticipation":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        {showTitle && (
          <CardTitle>
            Emotional State
            <span className="ml-2 text-sm font-normal text-muted-foreground capitalize">
              (Dominant: {emotionalState.dominant})
            </span>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emotions.map(([emotion, value]) => (
            <div key={emotion} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{emotion}</span>
                <span className="text-sm text-muted-foreground">{((value as number) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getEmotionColor(emotion)}`}
                  style={{ width: `${(value as number) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Emotion Radar Chart (simplified visual representation) */}
        <div className="mt-8 relative h-64 w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-gray-200 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border border-gray-200 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-gray-200"></div>
                </div>
              </div>
            </div>

            {/* Emotion points */}
            {emotions.map(([emotion, value], index) => {
              const angle = (index * Math.PI * 2) / emotions.length
              const radius = (value as number) * 96 // 48 * 2 (max radius)
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={emotion}
                  className={`absolute h-3 w-3 rounded-full ${getEmotionColor(emotion)}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                  }}
                  title={`${emotion}: ${((value as number) * 100).toFixed(0)}%`}
                ></div>
              )
            })}

            {/* Emotion labels */}
            {emotions.map(([emotion], index) => {
              const angle = (index * Math.PI * 2) / emotions.length
              const radius = 120 // Label radius
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={`label-${emotion}`}
                  className="absolute text-xs font-medium capitalize"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    textAlign: "center",
                    width: "60px",
                    marginLeft: "-30px",
                    marginTop: "-10px",
                  }}
                >
                  {emotion}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonaEmotionVisualizer
