/**
 * Neural Network Implementation
 *
 * A lightweight feedforward neural network with backpropagation
 * that can run efficiently in the browser.
 */

// Activation functions and their derivatives
export const activationFunctions = {
  sigmoid: {
    activate: (x: number) => 1 / (1 + Math.exp(-x)),
    derivative: (x: number) => {
      const fx = 1 / (1 + Math.exp(-x))
      return fx * (1 - fx)
    },
  },
  tanh: {
    activate: (x: number) => Math.tanh(x),
    derivative: (x: number) => 1 - Math.pow(Math.tanh(x), 2),
  },
  relu: {
    activate: (x: number) => Math.max(0, x),
    derivative: (x: number) => (x > 0 ? 1 : 0),
  },
  leakyRelu: {
    activate: (x: number) => (x > 0 ? x : 0.01 * x),
    derivative: (x: number) => (x > 0 ? 1 : 0.01),
  },
}

export type ActivationFunction = keyof typeof activationFunctions

export interface NeuralNetworkConfig {
  inputSize: number
  hiddenLayers: number[]
  outputSize: number
  activation: ActivationFunction
  learningRate: number
}

export class NeuralNetwork {
  private weights: number[][][]
  private biases: number[][]
  private activation: ActivationFunction
  private learningRate: number
  private layers: number[]

  /**
   * Create a new neural network
   *
   * @param config - Neural network configuration
   */
  constructor(config: NeuralNetworkConfig) {
    this.activation = config.activation
    this.learningRate = config.learningRate

    // Create layer structure
    this.layers = [config.inputSize, ...config.hiddenLayers, config.outputSize]

    // Initialize weights and biases
    this.weights = []
    this.biases = []

    // Initialize weights with Xavier/Glorot initialization
    for (let i = 0; i < this.layers.length - 1; i++) {
      const layerWeights: number[][] = []
      const layerBiases: number[] = []

      const limit = Math.sqrt(6 / (this.layers[i] + this.layers[i + 1]))

      for (let j = 0; j < this.layers[i]; j++) {
        const neuronWeights: number[] = []

        for (let k = 0; k < this.layers[i + 1]; k++) {
          // Random weights between -limit and limit
          neuronWeights.push(Math.random() * 2 * limit - limit)
        }

        layerWeights.push(neuronWeights)
      }

      // Initialize biases to small random values
      for (let j = 0; j < this.layers[i + 1]; j++) {
        layerBiases.push(Math.random() * 0.2 - 0.1)
      }

      this.weights.push(layerWeights)
      this.biases.push(layerBiases)
    }
  }

  /**
   * Forward propagation to make predictions
   *
   * @param inputs - Input values for the neural network
   * @returns The output values and all activations for each layer
   */
  private forward(inputs: number[]): {
    outputs: number[]
    activations: number[][]
    weightedSums: number[][]
  } {
    if (inputs.length !== this.layers[0]) {
      throw new Error(`Input size ${inputs.length} does not match network input layer size ${this.layers[0]}`)
    }

    // Store activations for each layer (including input layer)
    const activations: number[][] = [inputs]

    // Store weighted sums for each layer (excluding input layer)
    const weightedSums: number[][] = []

    // Current layer's activations
    let currentActivations = inputs

    // Forward propagation through each layer
    for (let i = 0; i < this.layers.length - 1; i++) {
      const layerWeights = this.weights[i]
      const layerBiases = this.biases[i]

      // Calculate weighted sums for the next layer
      const weightedSum: number[] = new Array(this.layers[i + 1]).fill(0)

      // For each neuron in the current layer
      for (let j = 0; j < this.layers[i]; j++) {
        // For each neuron in the next layer
        for (let k = 0; k < this.layers[i + 1]; k++) {
          weightedSum[k] += currentActivations[j] * layerWeights[j][k]
        }
      }

      // Add biases
      for (let k = 0; k < this.layers[i + 1]; k++) {
        weightedSum[k] += layerBiases[k]
      }

      weightedSums.push(weightedSum)

      // Apply activation function
      const nextActivations = weightedSum.map((sum) => activationFunctions[this.activation].activate(sum))

      // Store activations for this layer
      activations.push(nextActivations)

      // Update current activations for the next iteration
      currentActivations = nextActivations
    }

    return {
      outputs: currentActivations,
      activations,
      weightedSums,
    }
  }

  /**
   * Make a prediction with the neural network
   *
   * @param inputs - Input values for the neural network
   * @returns The predicted output values
   */
  predict(inputs: number[]): number[] {
    const { outputs } = this.forward(inputs)
    return outputs
  }

  /**
   * Train the neural network with a single example
   *
   * @param inputs - Input values for the neural network
   * @param targets - Target output values
   * @returns The error (mean squared error)
   */
  train(inputs: number[], targets: number[]): number {
    if (targets.length !== this.layers[this.layers.length - 1]) {
      throw new Error(
        `Target size ${targets.length} does not match network output layer size ${this.layers[this.layers.length - 1]}`,
      )
    }

    // Forward pass
    const { outputs, activations, weightedSums } = this.forward(inputs)

    // Calculate output layer error (MSE)
    const outputErrors = targets.map((target, i) => target - outputs[i])
    const mse = outputErrors.reduce((sum, error) => sum + error * error, 0) / outputErrors.length

    // Backpropagation
    // Start with output layer deltas
    let deltas: number[] = outputErrors.map((error, i) => {
      const weightedSum = weightedSums[weightedSums.length - 1][i]
      return error * activationFunctions[this.activation].derivative(weightedSum)
    })

    // Backpropagate through each layer
    for (let i = this.layers.length - 2; i >= 0; i--) {
      // Update weights and biases for this layer
      for (let j = 0; j < this.layers[i]; j++) {
        for (let k = 0; k < this.layers[i + 1]; k++) {
          // Update weight: learning rate * delta * activation
          this.weights[i][j][k] += this.learningRate * deltas[k] * activations[i][j]
        }
      }

      // Update biases: learning rate * delta
      for (let k = 0; k < this.layers[i + 1]; k++) {
        this.biases[i][k] += this.learningRate * deltas[k]
      }

      // Calculate deltas for previous layer (if not input layer)
      if (i > 0) {
        const newDeltas: number[] = new Array(this.layers[i - 1]).fill(0)

        // For each neuron in the current layer
        for (let j = 0; j < this.layers[i]; j++) {
          // For each neuron in the previous layer
          for (let k = 0; k < this.layers[i - 1]; k++) {
            // Sum up the deltas * weights
            newDeltas[k] += deltas[j] * this.weights[i - 1][k][j]
          }
        }

        // Apply activation derivative
        deltas = newDeltas.map((delta, idx) => {
          const weightedSum = weightedSums[i - 1][idx]
          return delta * activationFunctions[this.activation].derivative(weightedSum)
        })
      }
    }

    return mse
  }

  /**
   * Train the neural network with multiple examples
   *
   * @param dataset - Array of [inputs, targets] pairs
   * @param epochs - Number of training epochs
   * @param batchSize - Batch size for mini-batch training (0 for full batch)
   * @param shuffle - Whether to shuffle the dataset before each epoch
   * @returns Array of errors for each epoch
   */
  trainBatch(dataset: [number[], number[]][], epochs = 100, batchSize = 0, shuffle = true): number[] {
    const errors: number[] = []

    for (let epoch = 0; epoch < epochs; epoch++) {
      // Shuffle dataset if needed
      if (shuffle) {
        dataset = [...dataset].sort(() => Math.random() - 0.5)
      }

      let epochError = 0

      // Full batch or mini-batch training
      if (batchSize <= 0 || batchSize >= dataset.length) {
        // Full batch training
        for (const [inputs, targets] of dataset) {
          epochError += this.train(inputs, targets)
        }
        epochError /= dataset.length
      } else {
        // Mini-batch training
        for (let i = 0; i < dataset.length; i += batchSize) {
          const batch = dataset.slice(i, i + batchSize)
          let batchError = 0

          for (const [inputs, targets] of batch) {
            batchError += this.train(inputs, targets)
          }

          epochError += batchError / batch.length
        }

        epochError /= Math.ceil(dataset.length / batchSize)
      }

      errors.push(epochError)
    }

    return errors
  }

  /**
   * Save the neural network to a JSON string
   *
   * @returns JSON string representation of the neural network
   */
  toJSON(): string {
    return JSON.stringify({
      layers: this.layers,
      weights: this.weights,
      biases: this.biases,
      activation: this.activation,
      learningRate: this.learningRate,
    })
  }

  /**
   * Load a neural network from a JSON string
   *
   * @param json - JSON string representation of a neural network
   * @returns A new NeuralNetwork instance
   */
  static fromJSON(json: string): NeuralNetwork {
    const data = JSON.parse(json)

    const config: NeuralNetworkConfig = {
      inputSize: data.layers[0],
      hiddenLayers: data.layers.slice(1, -1),
      outputSize: data.layers[data.layers.length - 1],
      activation: data.activation,
      learningRate: data.learningRate,
    }

    const nn = new NeuralNetwork(config)
    nn.weights = data.weights
    nn.biases = data.biases

    return nn
  }

  /**
   * Get the network architecture as a string
   *
   * @returns String representation of the network architecture
   */
  getArchitecture(): string {
    return this.layers.join("-")
  }
}
