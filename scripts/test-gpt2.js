// This script tests a locally downloaded GPT-2 model
// Run with: node scripts/test-gpt2.js

const { pipeline } = require("transformers")
const path = require("path")
const readline = require("readline")

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function main() {
  try {
    // Path to the downloaded model
    const modelPath = path.join(__dirname, "..", "models", "gpt2")

    console.log("Loading GPT-2 model...")

    // Load the text generation pipeline
    const generator = await pipeline("text-generation", modelPath)

    console.log('Model loaded! Enter a prompt (or type "exit" to quit):')

    // Start the prompt loop
    promptUser(generator)
  } catch (error) {
    console.error("Error:", error)
    rl.close()
  }
}

function promptUser(generator) {
  rl.question("> ", async (prompt) => {
    if (prompt.toLowerCase() === "exit") {
      rl.close()
      return
    }

    try {
      console.log("Generating...")

      // Generate text based on the prompt
      const result = await generator(prompt, {
        max_length: 100,
        num_return_sequences: 1,
        temperature: 0.7,
      })

      console.log("\nGenerated text:")
      console.log(result[0].generated_text)
      console.log("-------------------")

      // Continue the loop
      promptUser(generator)
    } catch (error) {
      console.error("Generation error:", error)
      promptUser(generator)
    }
  })
}

// Start the script
main()
