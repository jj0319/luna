/**
 * XOR Example
 *
 * Demonstrates training a neural network on the XOR problem,
 * which is a classic example that requires a hidden layer.
 */

import { NeuralNetwork } from "../lib/neural-network"

// XOR dataset: [inputs, expected outputs]
const xorDataset: [number[], number[]][] = [
  [[0, 0], [0]],
  [[0, 1], [1]],
  [[1, 0], [1]],
  [[1, 1], [0]],
]

// Create a neural network with 2 inputs, 4 hidden neurons, and 1 output
const nn = new NeuralNetwork([2, 4, 1], "sigmoid", 0.1)

// Train the network
console.log("Training neural network on XOR problem...")
const errors = nn.trainBatch(xorDataset, 10000, 0, true)

// Print final error
console.log(`Final error: ${errors[errors.length - 1]}`)

// Test the network
console.log("\nTesting neural network:")
for (const [inputs, expected] of xorDataset) {
  const output = nn.predict(inputs)
  console.log(`Input: [${inputs}], Expected: [${expected}], Predicted: [${output}]`)
}

// Save the trained model
const savedModel = nn.toJSON()
console.log("\nSaved model:")
console.log(savedModel)

// Load the model
console.log("\nLoading model...")
const loadedNN = NeuralNetwork.fromJSON(savedModel)

// Test the loaded model
console.log("\nTesting loaded model:")
for (const [inputs, expected] of xorDataset) {
  const output = loadedNN.predict(inputs)
  console.log(`Input: [${inputs}], Expected: [${expected}], Predicted: [${output}]`)
}
