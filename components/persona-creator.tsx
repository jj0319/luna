"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { personaCustomizer } from "@/lib/persona-customizer"
import type { PersonaTrait, EmotionalState } from "@/lib/persona-system"
import { Loader2, RefreshCw, Trash } from "lucide-react"

export function PersonaCreator() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Basic info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [backstory, setBackstory] = useState("")

  // Traits
  const [traits, setTraits] = useState<PersonaTrait[]>([
    { name: "openness", value: 0.5, description: "Open to new ideas and experiences" },
    { name: "conscientiousness", value: 0.5, description: "Organized and detail-oriented" },
    { name: "extraversion", value: 0.5, description: "Outgoing and sociable" },
    { name: "agreeableness", value: 0.5, description: "Kind, cooperative, and empathetic" },
    { name: "neuroticism", value: 0.5, description: "Emotional sensitivity and reactivity" },
  ])

  // Emotional state
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    joy: 0.5,
    sadness: 0.1,
    anger: 0.1,
    fear: 0.1,
    surprise: 0.3,
    disgust: 0.1,
    trust: 0.5,
    anticipation: 0.4,
    dominant: "joy",
  })

  // Voice settings
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 1.0,
    rate: 1.0,
    voice: "female",
  })

  // Visual settings
  const [visualSettings, setVisualSettings] = useState({
    avatarUrl: "/personas/custom.png",
    expressionSet: "neutral",
    animationStyle: "smooth",
  })

  // Conversation style
  const [conversationStyle, setConversationStyle] = useState({
    verbosity: 0.5,
    formality: 0.5,
    humor: 0.5,
    empathy: 0.5,
    creativity: 0.5,
  })

  // Preferences
  const [preferences, setPreferences] = useState<Record<string, any>>({
    topics: ["technology", "science", "arts"],
    communicationStyle: "balanced",
  })

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      try {
        await personaCustomizer.initialize()
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize persona customizer:", error)
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  // Update dominant emotion when emotional state changes
  useEffect(() => {
    const emotions = { ...emotionalState }
    delete emotions.dominant

    const dominantEmotion = Object.entries(emotions).reduce(
      (max, [emotion, value]) => (value > max.value ? { emotion, value } : max),
      { emotion: "neutral", value: 0 },
    )

    if (dominantEmotion.value > 0) {
      setEmotionalState((prev) => ({ ...prev, dominant: dominantEmotion.emotion }))
    }
  }, [
    emotionalState.joy,
    emotionalState.sadness,
    emotionalState.anger,
    emotionalState.fear,
    emotionalState.surprise,
    emotionalState.disgust,
    emotionalState.trust,
    emotionalState.anticipation,
  ])

  const handleTraitChange = (traitName: string, value: number) => {
    setTraits((prev) => prev.map((trait) => (trait.name === traitName ? { ...trait, value } : trait)))
  }

  const handleEmotionChange = (emotion: keyof EmotionalState, value: number) => {
    if (emotion !== "dominant") {
      setEmotionalState((prev) => ({ ...prev, [emotion]: value }))
    }
  }

  const handleVoiceSettingChange = (setting: keyof typeof voiceSettings, value: any) => {
    setVoiceSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleConversationStyleChange = (style: keyof typeof conversationStyle, value: number) => {
    setConversationStyle((prev) => ({ ...prev, [style]: value }))
  }

  const handleSavePersona = async () => {
    if (!name) {
      setSaveMessage("Please provide a name for your persona")
      return
    }

    setIsSaving(true)
    setSaveMessage("")

    try {
      const personaData = {
        name,
        description: description || `A custom AI assistant named ${name}`,
        traits,
        baseEmotionalState: emotionalState,
        voiceSettings,
        visualSettings: {
          ...visualSettings,
          avatarUrl: `/personas/${name.toLowerCase()}.png`,
        },
        preferences,
        backstory: backstory || `${name} was created to be a helpful AI assistant with a unique personality.`,
        conversationStyle,
      }

      const personaId = personaCustomizer.createPersona(personaData)

      if (personaId) {
        setSaveMessage(`Persona "${name}" created successfully!`)
        // Reset form after successful save
        setTimeout(() => {
          resetForm()
        }, 2000)
      } else {
        setSaveMessage("Failed to create persona")
      }
    } catch (error) {
      console.error("Error creating persona:", error)
      setSaveMessage("Error creating persona")
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateRandom = async () => {
    setIsGenerating(true)

    try {
      // Generate a random name if none provided
      const randomName = name || generateRandomName()

      const randomPersona = personaCustomizer.generateRandomPersona(randomName)

      // Update all state with random values
      setName(randomPersona.name)
      setDescription(randomPersona.description)
      setBackstory(randomPersona.backstory)
      setTraits(randomPersona.traits)
      setEmotionalState(randomPersona.baseEmotionalState)
      setVoiceSettings(randomPersona.voiceSettings)
      setVisualSettings(randomPersona.visualSettings)
      setConversationStyle(randomPersona.conversationStyle)
      setPreferences(randomPersona.preferences)
    } catch (error) {
      console.error("Error generating random persona:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setBackstory("")
    setTraits([
      { name: "openness", value: 0.5, description: "Open to new ideas and experiences" },
      { name: "conscientiousness", value: 0.5, description: "Organized and detail-oriented" },
      { name: "extraversion", value: 0.5, description: "Outgoing and sociable" },
      { name: "agreeableness", value: 0.5, description: "Kind, cooperative, and empathetic" },
      { name: "neuroticism", value: 0.5, description: "Emotional sensitivity and reactivity" },
    ])
    setEmotionalState({
      joy: 0.5,
      sadness: 0.1,
      anger: 0.1,
      fear: 0.1,
      surprise: 0.3,
      disgust: 0.1,
      trust: 0.5,
      anticipation: 0.4,
      dominant: "joy",
    })
    setVoiceSettings({
      pitch: 1.0,
      rate: 1.0,
      voice: "female",
    })
    setVisualSettings({
      avatarUrl: "/personas/custom.png",
      expressionSet: "neutral",
      animationStyle: "smooth",
    })
    setConversationStyle({
      verbosity: 0.5,
      formality: 0.5,
      humor: 0.5,
      empathy: 0.5,
      creativity: 0.5,
    })
    setPreferences({
      topics: ["technology", "science", "arts"],
      communicationStyle: "balanced",
    })
    setSaveMessage("")
  }

  const generateRandomName = () => {
    const prefixes = ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Dakota"]
    const suffixes = ["AI", "Bot", "Mind", "Brain", "Genius", "Helper", "Guide", "Sage", "Guru", "Wizard"]

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]

    return `${randomPrefix} ${randomSuffix}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Create a Custom AI Persona</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleGenerateRandom} disabled={isGenerating || isSaving}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate Random
              </Button>
              <Button variant="outline" size="sm" onClick={resetForm} disabled={isSaving}>
                <Trash className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter persona name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this persona"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  placeholder="Detailed backstory for this persona"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Topics of Interest</Label>
                <div className="flex flex-wrap gap-2">
                  {preferences.topics.map((topic: string) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Personality Traits</h3>

                {traits.map((trait) => (
                  <div key={trait.name} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor={`trait-${trait.name}`} className="capitalize">
                        {trait.name}
                      </Label>
                      <span className="text-sm text-muted-foreground">{(trait.value * 10).toFixed(1)}/10</span>
                    </div>
                    <Slider
                      id={`trait-${trait.name}`}
                      min={0}
                      max={1}
                      step={0.1}
                      value={[trait.value]}
                      onValueChange={(values) => handleTraitChange(trait.name, values[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{trait.description}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Emotional Baseline</h3>

                {Object.entries(emotionalState)
                  .filter(([key]) => key !== "dominant")
                  .map(([emotion, value]) => (
                    <div key={emotion} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`emotion-${emotion}`} className="capitalize">
                          {emotion}
                        </Label>
                        <span className="text-sm text-muted-foreground">{((value as number) * 10).toFixed(1)}/10</span>
                      </div>
                      <Slider
                        id={`emotion-${emotion}`}
                        min={0}
                        max={1}
                        step={0.1}
                        value={[value as number]}
                        onValueChange={(values) => handleEmotionChange(emotion as keyof EmotionalState, values[0])}
                      />
                    </div>
                  ))}

                <div className="mt-2">
                  <Label>Dominant Emotion</Label>
                  <Badge className="ml-2">{emotionalState.dominant}</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Conversation Style</h3>

                {Object.entries(conversationStyle).map(([style, value]) => (
                  <div key={style} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor={`style-${style}`} className="capitalize">
                        {style}
                      </Label>
                      <span className="text-sm text-muted-foreground">{(value * 10).toFixed(1)}/10</span>
                    </div>
                    <Slider
                      id={`style-${style}`}
                      min={0}
                      max={1}
                      step={0.1}
                      value={[value]}
                      onValueChange={(values) =>
                        handleConversationStyleChange(style as keyof typeof conversationStyle, values[0])
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Voice Settings</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="voice-type" className="block mb-2">
                      Voice Type
                    </Label>
                    <RadioGroup
                      id="voice-type"
                      value={voiceSettings.voice}
                      onValueChange={(value) => handleVoiceSettingChange("voice", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="voice-pitch">Pitch</Label>
                      <span className="text-sm text-muted-foreground">{voiceSettings.pitch.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="voice-pitch"
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      value={[voiceSettings.pitch]}
                      onValueChange={(values) => handleVoiceSettingChange("pitch", values[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Lower</span>
                      <span>Higher</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="voice-rate">Speaking Rate</Label>
                      <span className="text-sm text-muted-foreground">{voiceSettings.rate.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="voice-rate"
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      value={[voiceSettings.rate]}
                      onValueChange={(values) => handleVoiceSettingChange("rate", values[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="flex justify-center mb-6">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl">{name ? name.charAt(0) : "?"}</AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Expression Style</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expression-set" className="block mb-2">
                      Expression Set
                    </Label>
                    <RadioGroup
                      id="expression-set"
                      value={visualSettings.expressionSet}
                      onValueChange={(value) => setVisualSettings((prev) => ({ ...prev, expressionSet: value }))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friendly" id="friendly" />
                        <Label htmlFor="friendly">Friendly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="analytical" id="analytical" />
                        <Label htmlFor="analytical">Analytical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expressive" id="expressive" />
                        <Label htmlFor="expressive">Expressive</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wise" id="wise" />
                        <Label htmlFor="wise">Wise</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="animation-style" className="block mb-2">
                      Animation Style
                    </Label>
                    <RadioGroup
                      id="animation-style"
                      value={visualSettings.animationStyle}
                      onValueChange={(value) => setVisualSettings((prev) => ({ ...prev, animationStyle: value }))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="smooth" id="smooth" />
                        <Label htmlFor="smooth">Smooth</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="precise" id="precise" />
                        <Label htmlFor="precise">Precise</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dynamic" id="dynamic" />
                        <Label htmlFor="dynamic">Dynamic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deliberate" id="deliberate" />
                        <Label htmlFor="deliberate">Deliberate</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <Button onClick={handleSavePersona} disabled={isSaving || !name}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Persona"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PersonaCreator
