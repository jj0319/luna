# Luna Build Troubleshooting Guide

This document provides solutions for common issues encountered when building the Luna application.

## Common Error: Process finished with non-zero exit value 1

This generic error indicates that Node.js exited with an error. Here are steps to diagnose and fix:

### Step 1: Check Node.js and npm versions

Ensure you have Node.js v18+ and npm v9+ installed:

\`\`\`bash
node --version
npm --version
\`\`\`

### Step 2: Run the debug build script

Use the debug build script to get more detailed error information:

\`\`\`bash
# Windows
build-luna-debug.bat

# macOS/Linux
node build-luna-debug.js
\`\`\`

### Step 3: Check for common issues

1. **Missing dependencies**:
   - Try deleting `node_modules` folder and `package-lock.json`
   - Run `npm install` again

2. **Environment variables**:
   - Ensure `.env.local` file exists with required API keys
   - Check that API keys are valid

3. **Build configuration**:
   - Verify `next.config.mjs` is correctly configured
   - Check for syntax errors in configuration files

4. **Disk space**:
   - Ensure you have at least 2GB of free disk space

5. **Permission issues**:
   - Run the command prompt or terminal as administrator

### Step 4: Check specific build logs

- For Next.js build issues, check the `.next/build-error.log` file
- For Electron build issues, check the `dist/builder-debug.yml` file

## Gradle-specific Issues

If you're using Gradle to build the project:

1. **Plugin compatibility**:
   - Ensure you're using Gradle 7.0+ with the Node Gradle plugin 3.5.1

2. **Node.js execution**:
   - Try setting `download = false` in the node configuration and use your system's Node.js

3. **Command execution**:
   - Use the direct execution tasks (`npmInstallDirect`, `buildNextAppDirect`) instead of the NpmTask-based ones

## Still Having Issues?

If you're still encountering problems:

1. Try the direct build approach without Gradle:
   \`\`\`bash
   npm install
   npm run build
   npm run build-win-exe
   \`\`\`

2. Check the GitHub issues for similar problems and solutions

3. Create a new issue with detailed logs and environment information
