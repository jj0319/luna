/**
 * Digit Recognition Example
 *
 * Demonstrates training a neural network to recognize handwritten digits
 * using a simplified dataset (3x3 pixel representations).
 */

import { NeuralNetwork } from "../lib/neural-network"

// Simplified digit representations (3x3 pixels)
// Each digit is represented as a 3x3 grid of 0s and 1s
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

// Create a neural network with 9 inputs (3x3 pixels), 15 hidden neurons, and 10 outputs (one per digit)
const nn = new NeuralNetwork([9, 15, 10], "sigmoid", 0.1)

// Train the network
console.log("Training neural network on digit recognition...")
const errors = nn.trainBatch(dataset, 10000, 0, true)

// Print final error
console.log(`Final error: ${errors[errors.length - 1]}`)

// Test the network
console.log("\nTesting neural network:")
for (let digit = 0; digit <= 9; digit++) {
  const input = digitData[digit]
  const output = nn.predict(input)

  // Find the highest probability digit
  const predictedDigit = output.indexOf(Math.max(...output))

  console.log(`Input: digit ${digit}, Predicted: ${predictedDigit} (confidence: ${output[predictedDigit].toFixed(4)})`)
}

// Test with a slightly modified input to see how the network handles noise
console.log("\nTesting with noisy input:")
const noisyFive = [
  1,
  1,
  1,
  1,
  0,
  0, // Changed one pixel
  1,
  1,
  1,
]

const output = nn.predict(noisyFive)
const predictedDigit = output.indexOf(Math.max(...output))
console.log(`Input: noisy 5, Predicted: ${predictedDigit} (confidence: ${output[predictedDigit].toFixed(4)})`)

// Print all confidence scores
console.log("\nConfidence scores for noisy input:")
output.forEach((confidence, digit) => {
  console.log(`Digit ${digit}: ${confidence.toFixed(4)}`)
})
