const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// 빌드 스크립트
console.log("Next.js 프로젝트 빌드 중...")
execSync("npm run build", { stdio: "inherit" })
console.log("Next.js 프로젝트 정적 내보내기 중...")
execSync("npm run export", { stdio: "inherit" })

// Capacitor 초기화
console.log("Capacitor 초기화 중...")
if (!fs.existsSync("capacitor.config.json")) {
  execSync('npx cap init "AI 연구 플랫폼" "com.airesearch.app" --web-dir="out"', { stdio: "inherit" })
}

// 안드로이드 플랫폼 추가
console.log("안드로이드 플랫폼 추가 중...")
if (!fs.existsSync("android")) {
  execSync("npx cap add android", { stdio: "inherit" })
}

// iOS 플랫폼 추가 (Mac OS에서만 작동)
if (process.platform === "darwin") {
  console.log("iOS 플랫폼 추가 중...")
  if (!fs.existsSync("ios")) {
    execSync("npx cap add ios", { stdio: "inherit" })
  }
}

// 변경사항 동기화
console.log("변경사항 동기화 중...")
execSync("npx cap sync", { stdio: "inherit" })

console.log("앱 빌드 완료!")
console.log("안드로이드 스튜디오로 열기: npx cap open android")
if (process.platform === "darwin") {
  console.log("Xcode로 열기: npx cap open ios")
}
