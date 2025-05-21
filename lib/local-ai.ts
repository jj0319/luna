/**
 * Local AI Module
 *
 * This module provides functions for text generation using locally downloaded models
 * without requiring external API calls. It uses the @xenova/transformers library,
 * which is a pure JavaScript implementation of Hugging Face's Transformers.
 */

import { pipeline, env } from "@xenova/transformers"

// Define available local models
export const LOCAL_MODELS = {
  GPT2_SMALL: "gpt2",
  GPT2_MEDIUM: "gpt2-medium",
  GPT2_LARGE: "gpt2-large",
  GPT2_XL: "gpt2-xl",
}

// Cache for loaded models to avoid reloading
const modelCache = new Map()

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

/**
 * Configure the library based on environment
 */
if (isBrowser) {
  // Browser-specific configuration
  env.useBrowserCache = true
  env.allowLocalModels = false // Don't try to load from local filesystem in browser
} else {
  // Node.js-specific configuration
  const fs = require("fs")
  const path = require("path")
  env.localModelPath = path.join(process.cwd(), "models")
  env.allowLocalModels = true
  env.useLocalModels = true
  env.useBrowserCache = false
}

/**
 * Checks if a model exists locally
 *
 * @param modelName - The name of the model to check
 * @returns boolean indicating if the model exists locally
 */
export function isModelAvailableLocally(modelName: string): boolean {
  if (isBrowser) {
    // In browser, we can't check local filesystem
    // Return false to indicate models need to be downloaded from HF
    return false
  }

  try {
    const fs = require("fs")
    const path = require("path")
    const modelPath = path.join(process.cwd(), "models", modelName)

    return (
      fs.existsSync(modelPath) &&
      fs.existsSync(path.join(modelPath, "pytorch_model.bin")) &&
      fs.existsSync(path.join(modelPath, "config.json"))
    )
  } catch (error) {
    console.error("Error checking model availability:", error)
    return false
  }
}

/**
 * Gets a list of all locally available models
 *
 * @returns Array of model names that are available locally
 */
export function getAvailableLocalModels(): string[] {
  if (isBrowser) {
    // In browser, we can't check local filesystem
    return []
  }

  try {
    const fs = require("fs")
    const path = require("path")
    const modelsDir = path.join(process.cwd(), "models")

    if (!fs.existsSync(modelsDir)) {
      return []
    }

    const items = fs.readdirSync(modelsDir, { withFileTypes: true })
    const modelDirs = items.filter((item) => item.isDirectory()).map((item) => item.name)

    return modelDirs.filter((dir) => isModelAvailableLocally(dir))
  } catch (error) {
    console.error("Error getting available models:", error)
    return []
  }
}

/**
 * Loads a text generation model
 *
 * @param modelName - The name of the model to load
 * @returns A text generation pipeline
 */
export async function loadTextGenerationModel(modelName: string) {
  // Check if model is already loaded
  if (modelCache.has(modelName)) {
    return modelCache.get(modelName)
  }

  try {
    // In browser, we'll download the model from Hugging Face
    // In Node.js with useLocalModels=true, it will try to load from local path first
    const generator = await pipeline("text-generation", modelName)

    // Cache the model
    modelCache.set(modelName, generator)

    return generator
  } catch (error) {
    console.error(`Error loading model ${modelName}:`, error)
    throw new Error(`Failed to load model ${modelName}: ${error.message}`)
  }
}

/**
 * Generates text using a model
 *
 * @param modelName - The name of the model to use
 * @param prompt - The prompt to generate text from
 * @param options - Generation options
 * @returns The generated text
 */
export async function generateText(
  modelName: string,
  prompt: string,
  options: {
    maxLength?: number
    temperature?: number
    topK?: number
    topP?: number
    repetitionPenalty?: number
    stopSequences?: string[]
  } = {},
) {
  const generator = await loadTextGenerationModel(modelName)

  const defaultOptions = {
    maxLength: 100,
    temperature: 0.7,
    topK: 50,
    topP: 0.9,
    repetitionPenalty: 1.0,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const result = await generator(prompt, mergedOptions)
    return result[0].generated_text
  } catch (error) {
    console.error("Text generation error:", error)
    throw new Error(`Failed to generate text: ${error.message}`)
  }
}

/**
 * Streams text generation using a model
 * This is a simplified implementation that doesn't truly stream,
 * but simulates streaming by breaking the generation into chunks
 *
 * @param modelName - The name of the model to use
 * @param prompt - The prompt to generate text from
 * @param options - Generation options
 * @param onChunk - Callback for each generated chunk
 */
export async function streamText(
  modelName: string,
  prompt: string,
  options: {
    maxLength?: number
    temperature?: number
    topK?: number
    topP?: number
    repetitionPenalty?: number
    chunkSize?: number
  } = {},
  onChunk: (chunk: string) => void,
) {
  const generator = await loadTextGenerationModel(modelName)

  const defaultOptions = {
    maxLength: 100,
    temperature: 0.7,
    topK: 50,
    topP: 0.9,
    repetitionPenalty: 1.0,
    chunkSize: 10, // Number of tokens to generate at once
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    // Generate the full text
    const result = await generator(prompt, {
      max_length: mergedOptions.maxLength,
      temperature: mergedOptions.temperature,
      top_k: mergedOptions.topK,
      top_p: mergedOptions.topP,
      repetition_penalty: mergedOptions.repetitionPenalty,
    })

    const fullText = result[0].generated_text

    // Extract only the newly generated text (remove the prompt)
    const generatedText = fullText.slice(prompt.length)

    // Simulate streaming by sending chunks
    const chunks = []
    for (let i = 0; i < generatedText.length; i += mergedOptions.chunkSize) {
      const chunk = generatedText.slice(i, i + mergedOptions.chunkSize)
      chunks.push(chunk)

      // Call the callback with the chunk
      onChunk(chunk)

      // Add a small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    return fullText
  } catch (error) {
    console.error("Text streaming error:", error)
    throw new Error(`Failed to stream text: ${error.message}`)
  }
}
