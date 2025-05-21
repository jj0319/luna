const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Helper function to execute commands with better error handling
function runCommand(command, options = {}) {
  console.log(`Running command: ${command}`)
  try {
    const output = execSync(command, {
      stdio: "inherit",
      ...options,
    })
    return { success: true, output }
  } catch (error) {
    console.error(`Command failed: ${command}`)
    console.error(`Error: ${error.message}`)
    if (error.stdout) console.log(`stdout: ${error.stdout.toString()}`)
    if (error.stderr) console.error(`stderr: ${error.stderr.toString()}`)
    return { success: false, error }
  }
}

// Check environment
console.log("=== Environment Information ===")
console.log(`Node version: ${process.version}`)
runCommand("npm --version")
console.log(`Current directory: ${process.cwd()}`)
console.log(`Package.json exists: ${fs.existsSync("package.json")}`)

// Create .env file for API keys
console.log("\n=== Creating Environment Variables ===")
const envContent = `GOOGLE_API_KEY=AIzaSyAiFX1mcpCnMgsHqHvp8NJOAGU7ZN4yVDs
GOOGLE_ID=f4db37719b0144276
`
fs.writeFileSync(".env.local", envContent)
console.log("Created .env.local file with API keys")

// Install dependencies with detailed logging
console.log("\n=== Installing Dependencies ===")
const installResult = runCommand("npm install --verbose")
if (!installResult.success) {
  console.error("Failed to install dependencies. Exiting build process.")
  process.exit(1)
}

// Build Next.js application
console.log("\n=== Building Next.js Application ===")
const buildResult = runCommand("npm run build")
if (!buildResult.success) {
  console.error("Failed to build Next.js application. Exiting build process.")
  process.exit(1)
}

// Build Electron application (Windows)
console.log("\n=== Building Electron Application ===")
const electronBuildResult = runCommand("npm run build-win-exe")
if (!electronBuildResult.success) {
  console.error("Failed to build Electron application. Exiting build process.")
  process.exit(1)
}

console.log("\n=== Build Completed Successfully ===")
console.log("Luna application has been built successfully!")
console.log("You can find the installer in the dist/ directory.")
