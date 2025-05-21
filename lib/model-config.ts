import { huggingface } from "@ai-sdk/huggingface"
import type { AIModel } from "ai"

// Configuration for different model providers
export const modelProviders = {
  // Hugging Face models
  huggingface: {
    // GPT-2 models
    gpt2: huggingface("gpt2"),
    gpt2Medium: huggingface("gpt2-medium"),
    gpt2Large: huggingface("gpt2-large"),
    gpt2XL: huggingface("gpt2-xl"),

    // Other models (for comparison)
    mistral7b: huggingface("mistralai/Mistral-7B-Instruct-v0.2"),
    llama2: huggingface("meta-llama/Llama-2-7b-chat-hf"),
  },
}

// Default model to use - set to GPT-2
export const getDefaultModel = (): AIModel => {
  return modelProviders.huggingface.gpt2Medium
}
