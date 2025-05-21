/**
 * Neural Network Visualization Utilities
 *
 * Functions to help visualize neural network training progress.
 */

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/**
 * Create a simple ASCII progress bar
 */
export function progressBar(value: number, width = 20): string {
  const filledWidth = Math.round(value * width)
  const emptyWidth = width - filledWidth

  return "[" + "=".repeat(filledWidth) + " ".repeat(emptyWidth) + "] " + formatPercent(value)
}

/**
 * Print a confusion matrix for classification problems
 */
export function confusionMatrix(predictions: number[][], targets: number[][], labels: string[] = []): string {
  // Get the number of classes
  const numClasses = targets[0].length

  // Create labels if not provided
  const classLabels = labels.length === numClasses ? labels : Array.from({ length: numClasses }, (_, i) => `Class ${i}`)

  // Initialize confusion matrix with zeros
  const matrix: number[][] = Array(numClasses)
    .fill(0)
    .map(() => Array(numClasses).fill(0))

  // Fill the confusion matrix
  for (let i = 0; i < predictions.length; i++) {
    const predictedClass = predictions[i].indexOf(Math.max(...predictions[i]))
    const actualClass = targets[i].indexOf(Math.max(...targets[i]))

    matrix[actualClass][predictedClass]++
  }

  // Calculate accuracy, precision, and recall
  let totalCorrect = 0
  let total = 0

  const precision: number[] = Array(numClasses).fill(0)
  const recall: number[] = Array(numClasses).fill(0)

  for (let i = 0; i < numClasses; i++) {
    let columnSum = 0
    let rowSum = 0

    for (let j = 0; j < numClasses; j++) {
      if (i === j) {
        totalCorrect += matrix[i][j]
      }

      columnSum += matrix[j][i]
      rowSum += matrix[i][j]
      total += matrix[i][j]
    }

    precision[i] = columnSum === 0 ? 0 : matrix[i][i] / columnSum
    recall[i] = rowSum === 0 ? 0 : matrix[i][i] / rowSum
  }

  const accuracy = total === 0 ? 0 : totalCorrect / total

  // Build the confusion matrix string
  let result = "Confusion Matrix:\n\n"

  // Header row
  result += "       "
  for (let i = 0; i < numClasses; i++) {
    result += `${classLabels[i].padStart(7)} `
  }
  result += "  Recall\n"

  // Matrix rows
  for (let i = 0; i < numClasses; i++) {
    result += `${classLabels[i].padEnd(7)}`

    for (let j = 0; j < numClasses; j++) {
      result += `${matrix[i][j].toString().padStart(7)} `
    }

    result += `  ${formatPercent(recall[i])}\n`
  }

  // Precision row
  result += "Prec.  "
  for (let i = 0; i < numClasses; i++) {
    result += `${formatPercent(precision[i]).padStart(7)} `
  }

  // Overall accuracy
  result += `\n\nAccuracy: ${formatPercent(accuracy)}`

  return result
}

/**
 * Plot training error over epochs in ASCII
 */
export function plotErrors(errors: number[], width = 60, height = 15): string {
  if (errors.length === 0) return "No error data to plot"

  // Find min and max errors
  const minError = Math.min(...errors)
  const maxError = Math.max(...errors)

  // Scale errors to fit in the plot height
  const scaledErrors = errors.map(
    (error) => height - 1 - Math.floor(((error - minError) / (maxError - minError)) * (height - 1)),
  )

  // Create the plot
  const plot: string[] = Array(height)
    .fill("")
    .map(() => " ".repeat(width))

  // Draw the error line
  for (let i = 0; i < Math.min(width, errors.length); i++) {
    const x = Math.floor((i * errors.length) / width)
    const y = scaledErrors[x]

    // Replace the character at position (x, y) with a dot
    plot[y] = plot[y].substring(0, i) + "*" + plot[y].substring(i + 1)
  }

  // Add axes and labels
  let result = ""
  for (let i = 0; i < height; i++) {
    const errorValue = maxError - (i / (height - 1)) * (maxError - minError)
    result += errorValue.toFixed(4).padStart(8) + " |" + plot[i] + "\n"
  }

  // Add x-axis
  result += "         " + "-".repeat(width) + "\n"

  // Add epoch labels
  result +=
    "         0" +
    " ".repeat(width - 20) +
    `${Math.floor(errors.length / 2)}`.padStart(10) +
    " ".repeat(width - 20) +
    `${errors.length}`.padStart(10) +
    "\n"

  result += "         " + " ".repeat(width / 2 - 5) + "Training Epochs"

  return result
}
