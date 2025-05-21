const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const dotenv = require("dotenv")

// 환경 변수 로드 (있는 경우)
if (fs.existsSync(".env")) {
  dotenv.config()
}

console.log("🚀 Luna Windows 애플리케이션 빌드 시작...")

// 빌드 디렉토리 정리
console.log("🧹 빌드 디렉토리 정리 중...")
try {
  if (fs.existsSync("dist")) {
    execSync("rimraf dist", { stdio: "inherit" })
  }
  if (fs.existsSync(".next")) {
    execSync("rimraf .next", { stdio: "inherit" })
  }
  if (fs.existsSync("electron-dist")) {
    execSync("rimraf electron-dist", { stdio: "inherit" })
  }
} catch (error) {
  console.error("❌ 디렉토리 정리 중 오류 발생:", error)
  process.exit(1)
}

// Next.js 프로젝트 빌드
console.log("🔨 Next.js 프로젝트 빌드 중...")
try {
  execSync("npm run build", { stdio: "inherit" })
} catch (error) {
  console.error("❌ Next.js 빌드 중 오류 발생:", error)
  process.exit(1)
}

// Electron 빌드 준비
console.log("🔧 Electron 빌드 준비 중...")

// 빌드 디렉토리 생성
if (!fs.existsSync("electron-dist")) {
  fs.mkdirSync("electron-dist")
}

// TypeScript 컴파일
console.log("📝 TypeScript 파일 컴파일 중...")
try {
  execSync("npm run build-electron", { stdio: "inherit" })
} catch (error) {
  console.error("❌ TypeScript 컴파일 중 오류 발생:", error)
  process.exit(1)
}

// 리소스 디렉토리 확인
if (!fs.existsSync("build")) {
  fs.mkdirSync("build")
}

// 아이콘 파일 복사
console.log("🖼️ 리소스 파일 복사 중...")
if (fs.existsSync("public/icons/icon-512x512.png")) {
  fs.copyFileSync("public/icons/icon-512x512.png", "build/icon.png")
}

// Electron 빌드
console.log("🏗️ Electron 앱 빌드 중...")
try {
  execSync("electron-builder --win --x64", { stdio: "inherit" })
} catch (error) {
  console.error("❌ Electron 빌드 중 오류 발생:", error)
  process.exit(1)
}

console.log("✅ Windows .exe 파일 빌드 완료!")
console.log("📁 빌드된 파일은 dist 디렉토리에 있습니다.")
console.log("   - Luna-Setup-1.0.0.exe (인스톨러)")
console.log("   - Luna-Portable-1.0.0.exe (포터블 버전)")
