"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonaSystem, type Persona, type PersonaTrait } from "@/lib/persona-system"

export function PersonaSelector() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personas")

  useEffect(() => {
    const initializePersonas = async () => {
      try {
        const personaSystem = new PersonaSystem()
        await personaSystem.initialize()

        setPersonas(personaSystem.getAllPersonas())
        setActivePersonaId(personaSystem.getActivePersona()?.id || null)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize personas:", error)
        setIsLoading(false)
      }
    }

    initializePersonas()
  }, [])

  const handleSelectPersona = async (id: string) => {
    try {
      const personaSystem = new PersonaSystem()
      await personaSystem.initialize()

      if (personaSystem.setActivePersona(id)) {
        setActivePersonaId(id)
      }
    } catch (error) {
      console.error("Failed to set active persona:", error)
    }
  }

  const renderEmotionBadge = (emotion: string, value: number) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

    if (value > 0.7) {
      variant = "default"
    } else if (value > 0.4) {
      variant = "secondary"
    }

    return (
      <Badge key={emotion} variant={variant} className="mr-1 mb-1">
        {emotion}: {value.toFixed(2)}
      </Badge>
    )
  }

  const renderTraitBadge = (trait: PersonaTrait) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

    if (trait.value > 0.7) {
      variant = "default"
    } else if (trait.value > 0.4) {
      variant = "secondary"
    }

    return (
      <Badge key={trait.name} variant={variant} className="mr-1 mb-1" title={trait.description}>
        {trait.name}: {trait.value.toFixed(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personas">인격체 목록</TabsTrigger>
          <TabsTrigger value="details">상세 정보</TabsTrigger>
        </TabsList>

        <TabsContent value="personas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all ${
                  activePersonaId === persona.id ? "border-primary shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => handleSelectPersona(persona.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={persona.visualSettings.avatarUrl || "/placeholder.svg"} alt={persona.name} />
                      <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{persona.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {activePersonaId === persona.id && (
                          <Badge variant="outline" className="mr-1">
                            Active
                          </Badge>
                        )}
                        {persona.currentEmotionalState.dominant}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="line-clamp-2">{persona.description}</p>
                  <div className="mt-2">{persona.traits.slice(0, 3).map((trait) => renderTraitBadge(trait))}</div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant={activePersonaId === persona.id ? "default" : "outline"} size="sm" className="w-full">
                    {activePersonaId === persona.id ? "활성화됨" : "선택하기"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          {activePersonaId && personas.length > 0 && (
            <PersonaDetails persona={personas.find((p) => p.id === activePersonaId) || personas[0]} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PersonaDetailsProps {
  persona: Persona
}

function PersonaDetails({ persona }: PersonaDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={persona.visualSettings.avatarUrl || "/placeholder.svg"} alt={persona.name} />
            <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{persona.name}</CardTitle>
            <CardDescription>{persona.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Backstory</h3>
          <p>{persona.backstory}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Personality Traits</h3>
          <div className="flex flex-wrap">{persona.traits.map((trait) => renderTraitBadge(trait))}</div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Emotional State</h3>
          <div className="flex flex-wrap">
            {Object.entries(persona.currentEmotionalState)
              .filter(([key]) => key !== "dominant")
              .map(([emotion, value]) => renderEmotionBadge(emotion, value as number))}
          </div>
          <p className="mt-2 text-sm">
            Dominant emotion: <strong>{persona.currentEmotionalState.dominant}</strong>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Conversation Style</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(persona.conversationStyle).map(([style, value]) => (
              <div key={style} className="flex flex-col">
                <span className="text-sm font-medium capitalize">{style}</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${value * 100}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{(value * 10).toFixed(1)}/10</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Preferences</h3>
          <div className="space-y-2">
            {Object.entries(persona.preferences).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium capitalize">{key}: </span>
                {Array.isArray(value) ? <span>{value.join(", ")}</span> : <span>{String(value)}</span>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Voice Settings</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-sm font-medium">Pitch</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${persona.voiceSettings.pitch * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Rate</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${persona.voiceSettings.rate * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Voice</span>
              <p className="text-sm capitalize">{persona.voiceSettings.voice}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function renderTraitBadge(trait: PersonaTrait) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

  if (trait.value > 0.7) {
    variant = "default"
  } else if (trait.value > 0.4) {
    variant = "secondary"
  }

  return (
    <Badge key={trait.name} variant={variant} className="mr-1 mb-1" title={trait.description}>
      {trait.name}: {trait.value.toFixed(1)}
    </Badge>
  )
}

function renderEmotionBadge(emotion: string, value: number) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

  if (value > 0.7) {
    variant = "default"
  } else if (value > 0.4) {
    variant = "secondary"
  }

  return (
    <Badge key={emotion} variant={variant} className="mr-1 mb-1">
      {emotion}: {value.toFixed(2)}
    </Badge>
  )
}

export default PersonaSelector
