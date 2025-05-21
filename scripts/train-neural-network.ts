/**
 * Neural Network Training Script
 *
 * This script allows training a neural network from the command line.
 */

import * as readline from "readline"
import { NeuralNetwork } from "../lib/neural-network"
import { plotErrors } from "../lib/visualization"

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Ask a question and get the answer
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

// Main function
async function main() {
  console.log("=== Neural Network Training Script ===\n")

  // Choose a problem
  console.log("Choose a problem to solve:")
  console.log("1. XOR Problem")
  console.log("2. Digit Recognition")

  const problemChoice = await question("Enter your choice (1-2): ")

  if (problemChoice === "1") {
    await trainXOR()
  } else if (problemChoice === "2") {
    await trainDigitRecognition()
  } else {
    console.log("Invalid choice. Exiting.")
  }

  rl.close()
}

// Train XOR problem
async function trainXOR() {
  console.log("\n=== Training XOR Problem ===\n")

  // XOR dataset
  const xorDataset: [number[], number[]][] = [
    [[0, 0], [0]],
    [[0, 1], [1]],
    [[1, 0], [1]],
    [[1, 1], [0]],
  ]

  // Get network parameters
  const hiddenNeurons = Number.parseInt((await question("Enter number of hidden neurons (default: 4): ")) || "4")
  const learningRate = Number.parseFloat((await question("Enter learning rate (default: 0.1): ")) || "0.1")
  const epochs = Number.parseInt((await question("Enter number of epochs (default: 10000): ")) || "10000")

  // Create the network
  console.log(`\nCreating network with architecture: 2 -> ${hiddenNeurons} -> 1`)
  const nn = new NeuralNetwork([2, hiddenNeurons, 1], "sigmoid", learningRate)

  // Train the network
  console.log(`Training for ${epochs} epochs with learning rate ${learningRate}...`)

  const startTime = Date.now()
  const errors = nn.trainBatch(xorDataset, epochs)
  const endTime = Date.now()

  console.log(`\nTraining completed in ${(endTime - startTime) / 1000} seconds.`)
  console.log(`Final error: ${errors[errors.length - 1].toFixed(6)}`)

  // Plot errors
  console.log("\nTraining Error Plot:")
  console.log(plotErrors(errors))

  // Test the network
  console.log("\nTesting the network:")
  for (const [inputs, expected] of xorDataset) {
    const output = nn.predict(inputs)
    console.log(`Input: [${inputs}], Expected: [${expected}], Predicted: [${output[0].toFixed(4)}]`)
  }

  // Save the model
  const saveModel = await question("\nSave the model? (y/n): ")
  if (saveModel.toLowerCase() === "y") {
    const modelJson = nn.toJSON()
    console.log("\nModel JSON:")
    console.log(modelJson)
    console.log("\nCopy the above JSON to use with NeuralNetwork.fromJSON()")
  }
}

// Train digit recognition
async function trainDigitRecognition() {
  console.log("\n=== Training Digit Recognition ===\n")

  // Simplified digit representations (3x3 pixels)
  const digitData = {
    0: [1, 1, 1, 1, 0, 1, 1, 1, 1],
    1: [0, 1, 0, 0, 1, 0, 0, 1, 0],
    2: [1, 1, 1, 0, 1, 0, 1, 1, 1],
    3: [1, 1, 1, 0, 1, 1, 1, 1, 1],
    4: [1, 0, 1, 1, 1, 1, 0, 0, 1],
    5: [1, 1, 1, 1, 1, 0, 1, 1, 1],
    6: [1, 0, 0, 1, 1, 1, 1, 1, 1],
    7: [1, 1, 1, 0, 0, 1, 0, 0, 1],
    8: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    9: [1, 1, 1, 1, 1, 1, 0, 0, 1],
  }

  // Create one-hot encoded outputs for each digit
  function oneHotEncode(digit: number): number[] {
    const encoded = new Array(10).fill(0)
    encoded[digit] = 1
    return encoded
  }

  // Create training dataset
  const dataset: [number[], number[]][] = []
  for (let digit = 0; digit <= 9; digit++) {
    dataset.push([digitData[digit], oneHotEncode(digit)])
  }

  // Get network parameters
  const hiddenNeurons = Number.parseInt((await question("Enter number of hidden neurons (default: 15): ")) || "15")
  const learningRate = Number.parseFloat((await question("Enter learning rate (default: 0.1): ")) || "0.1")
  const epochs = Number.parseInt((await question("Enter number of epochs (default: 10000): ")) || "10000")

  // Create the network
  console.log(`\nCreating network with architecture: 9 -> ${hiddenNeurons} -> 10`)
  const nn = new NeuralNetwork([9, hiddenNeurons, 10], "sigmoid", learningRate)

  // Train the network
  console.log(`Training for ${epochs} epochs with learning rate ${learningRate}...`)

  const startTime = Date.now()
  const errors = nn.trainBatch(dataset, epochs)
  const endTime = Date.now()

  console.log(`\nTraining completed in ${(endTime - startTime) / 1000} seconds.`)
  console.log(`Final error: ${errors[errors.length - 1].toFixed(6)}`)

  // Plot errors
  console.log("\nTraining Error Plot:")
  console.log(plotErrors(errors))

  // Test the network
  console.log("\nTesting the network:")
  for (let digit = 0; digit <= 9; digit++) {
    const output = nn.predict(digitData[digit])
    const predictedDigit = output.indexOf(Math.max(...output))
    console.log(
      `Digit: ${digit}, Predicted: ${predictedDigit}, Confidence: ${(output[predictedDigit] * 100).toFixed(2)}%`,
    )
  }

  // Save the model
  const saveModel = await question("\nSave the model? (y/n): ")
  if (saveModel.toLowerCase() === "y") {
    const modelJson = nn.toJSON()
    console.log("\nModel JSON:")
    console.log(modelJson)
    console.log("\nCopy the above JSON to use with NeuralNetwork.fromJSON()")
  }
}

// Run the main function
main().catch(console.error)
