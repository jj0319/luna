const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// 빌드 스크립트
console.log("Next.js 프로젝트 빌드 중...")
execSync("npm run build", { stdio: "inherit" })
console.log("Next.js 프로젝트 정적 내보내기 중...")
execSync("npm run export", { stdio: "inherit" })

// Electron 빌드 준비
console.log("Electron 빌드 준비 중...")

// preload.js 컴파일
console.log("Preload 스크립트 컴파일 중...")
execSync("tsc electron/preload.ts --outDir electron-dist", { stdio: "inherit" })

// main.js 컴파일
console.log("Main 스크립트 컴파일 중...")
execSync("tsc electron/main.ts --outDir electron-dist", { stdio: "inherit" })

// 리소스 디렉토리 확인
if (!fs.existsSync("resources")) {
  fs.mkdirSync("resources")
}

// 아이콘 파일 복사
console.log("리소스 파일 복사 중...")
if (fs.existsSync("public/icons/icon-512x512.png")) {
  fs.copyFileSync("public/icons/icon-512x512.png", "resources/icon.png")
}

// Electron 빌드
console.log("Electron 앱 빌드 중...")
execSync("electron-builder", { stdio: "inherit" })

console.log("데스크톱 앱 빌드 완료!")
console.log("빌드된 앱은 dist 디렉토리에 있습니다.")
