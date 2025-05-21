"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PersonaEmotionVisualizer } from "@/components/persona-emotion-visualizer"
import { PersonaSystem, type Persona } from "@/lib/persona-system"
import { Loader2 } from "lucide-react"

export default function PersonaEmotionsPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const personaSystem = new PersonaSystem()
        await personaSystem.initialize()

        const allPersonas = personaSystem.getAllPersonas()
        setPersonas(allPersonas)

        // Set active persona as default selected
        const activePersona = personaSystem.getActivePersona()
        if (activePersona) {
          setSelectedPersonaId(activePersona.id)
        } else if (allPersonas.length > 0) {
          setSelectedPersonaId(allPersonas[0].id)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load personas:", error)
        setIsLoading(false)
      }
    }

    loadPersonas()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId) || null

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Persona Emotions</h1>
        <p className="text-muted-foreground">Visualize and understand the emotional states of AI personas</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Select Persona</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPersonaId || ""} onValueChange={(value) => setSelectedPersonaId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((persona) => (
                  <SelectItem key={persona.id} value={persona.id}>
                    {persona.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedPersona && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Persona Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Name</h3>
                    <p>{selectedPersona.name}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p>{selectedPersona.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Personality Traits</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedPersona.traits.map((trait) => (
                        <div key={trait.name} className="flex justify-between">
                          <span className="capitalize">{trait.name}:</span>
                          <span>{(trait.value * 10).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Conversation Style</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(selectedPersona.conversationStyle).map(([style, value]) => (
                        <div key={style} className="flex justify-between">
                          <span className="capitalize">{style}:</span>
                          <span>{(value * 10).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PersonaEmotionVisualizer emotionalState={selectedPersona.currentEmotionalState} />
          </div>
        )}
      </div>
    </div>
  )
}
