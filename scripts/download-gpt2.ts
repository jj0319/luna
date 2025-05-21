/**
 * GPT-2 Model Downloader
 *
 * This script downloads GPT-2 model files for local inference.
 * It uses the @xenova/transformers library to download models.
 */

import { pipeline, env } from "@xenova/transformers"
import * as fs from "fs"
import * as path from "path"
import * as readline from "readline"

// Set the local model path
const MODELS_DIRECTORY = path.join(process.cwd(), "models")
env.localModelPath = MODELS_DIRECTORY
env.allowLocalModels = true
env.useLocalModels = true // Force using local models only

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIRECTORY)) {
  fs.mkdirSync(MODELS_DIRECTORY, { recursive: true })
}

/**
 * Available GPT-2 model variants
 */
const GPT2_MODELS = [
  {
    name: "gpt2",
    displayName: "GPT-2 (Small - 124M)",
    size: "~500MB",
  },
  {
    name: "gpt2-medium",
    displayName: "GPT-2 Medium (355M)",
    size: "~1.5GB",
  },
  {
    name: "gpt2-large",
    displayName: "GPT-2 Large (774M)",
    size: "~3GB",
  },
  {
    name: "gpt2-xl",
    displayName: "GPT-2 XL (1.5B)",
    size: "~6GB",
  },
]

/**
 * Downloads a model using the transformers library
 *
 * @param modelName - The name of the model to download
 * @returns A promise that resolves when the download is complete
 */
async function downloadModel(modelName: string): Promise<void> {
  console.log(`\nDownloading ${modelName}...`)

  try {
    // The pipeline function will automatically download the model
    console.log("Initializing download...")
    await pipeline("text-generation", modelName)
    console.log(`\n✓ ${modelName} downloaded successfully!`)
  } catch (error) {
    console.error(`\n✗ Error downloading ${modelName}:`, error.message)
  }
}

/**
 * Main function to run the download script
 */
async function main() {
  // Display header information
  console.log("\n=================================")
  console.log("       GPT-2 Model Downloader    ")
  console.log("=================================\n")
  console.log("This script will download GPT-2 model files for local inference.")
  console.log(`Models will be saved to the "${MODELS_DIRECTORY}" directory.`)
  console.log("\nAvailable models:")

  // Display available models
  GPT2_MODELS.forEach((model, index) => {
    console.log(`${index + 1}. ${model.displayName} (${model.size})`)
  })

  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // Prompt user for model selection
  rl.question('\nWhich model would you like to download? (Enter number, or "all" for all models): ', async (answer) => {
    rl.close()

    if (answer.toLowerCase() === "all") {
      // Download all models
      for (const model of GPT2_MODELS) {
        await downloadModel(model.name)
      }
      console.log("\n✓ All models downloaded successfully!")
    } else {
      // Download selected model
      const modelIndex = Number.parseInt(answer) - 1
      if (modelIndex >= 0 && modelIndex < GPT2_MODELS.length) {
        await downloadModel(GPT2_MODELS[modelIndex].name)
      } else {
        console.log("❌ Invalid selection. Exiting.")
      }
    }

    console.log("\nTo use the downloaded models, run your application with the local models.")
  })
}

// Execute the main function
main()
