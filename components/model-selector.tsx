/**
 * ModelSelector Component
 *
 * This component provides a dropdown to select local AI models.
 */

"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, HardDrive } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Types
interface ModelOption {
  id: string
  name: string
  description?: string
  isAvailable: boolean
}

interface ModelSelectorProps {
  onModelChange: (modelId: string) => void
  defaultModel?: string
}

export function ModelSelector({ onModelChange, defaultModel = "gpt2-medium" }: ModelSelectorProps) {
  // State
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [noModelsAvailable, setNoModelsAvailable] = useState(false)

  /**
   * Fetches locally available models
   */
  useEffect(() => {
    async function fetchLocalModels() {
      try {
        const response = await fetch("/api/check-models")

        if (response.ok) {
          const data = await response.json()
          const availableModels = data.availableModels || []

          // Create model options based on available models
          const options: ModelOption[] = [
            {
              id: "gpt2",
              name: "GPT-2 (Small)",
              description: "124M parameters",
              isAvailable: availableModels.includes("gpt2"),
            },
            {
              id: "gpt2-medium",
              name: "GPT-2 Medium",
              description: "355M parameters",
              isAvailable: availableModels.includes("gpt2-medium"),
            },
            {
              id: "gpt2-large",
              name: "GPT-2 Large",
              description: "774M parameters",
              isAvailable: availableModels.includes("gpt2-large"),
            },
            {
              id: "gpt2-xl",
              name: "GPT-2 XL",
              description: "1.5B parameters",
              isAvailable: availableModels.includes("gpt2-xl"),
            },
          ]

          setModelOptions(options)

          // Check if any models are available
          const anyAvailable = options.some((model) => model.isAvailable)
          setNoModelsAvailable(!anyAvailable)

          // If the default model is not available, select the first available model
          if (!options.find((model) => model.id === defaultModel)?.isAvailable) {
            const firstAvailable = options.find((model) => model.isAvailable)
            if (firstAvailable) {
              setSelectedModel(firstAvailable.id)
              onModelChange(firstAvailable.id)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch local models:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocalModels()
  }, [defaultModel, onModelChange])

  /**
   * Handles model selection change
   */
  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    onModelChange(value)
  }

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex justify-between items-center">
        <Label htmlFor="model-select">Model</Label>
        {noModelsAvailable && (
          <Button size="sm" variant="outline" asChild>
            <Link href="/model-download">
              <Download className="h-3 w-3 mr-2" />
              Download Models
            </Link>
          </Button>
        )}
      </div>
      <Select value={selectedModel} onValueChange={handleModelChange}>
        <SelectTrigger id="model-select" disabled={isLoading || noModelsAvailable}>
          <SelectValue
            placeholder={isLoading ? "Loading models..." : noModelsAvailable ? "No models available" : "Select a model"}
          />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="header-models" disabled className="font-semibold">
            Local Models
          </SelectItem>

          {modelOptions.map((model) => (
            <SelectItem key={model.id} value={model.id} disabled={!model.isAvailable}>
              <div className="flex items-center">
                {model.isAvailable ? (
                  <HardDrive className="h-3 w-3 mr-2 text-green-500" title="Available locally" />
                ) : (
                  <Download className="h-3 w-3 mr-2 text-gray-400" title="Not available - needs download" />
                )}
                <span>
                  {model.name} {model.description && `(${model.description})`}
                  {!model.isAvailable && " - Not Downloaded"}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
