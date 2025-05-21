const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// 리소스 디렉토리 생성
const resourcesDir = path.join(__dirname, "resources")
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir)
}

// 아이콘 생성 (512x512 아이콘 필요)
console.log("앱 아이콘 생성 중...")
if (fs.existsSync(path.join(resourcesDir, "icon.png"))) {
  execSync("npx capacitor-assets generate --iconSource resources/icon.png", { stdio: "inherit" })
} else {
  console.log("resources/icon.png 파일이 필요합니다. 512x512 크기의 PNG 파일을 준비해주세요.")
}

// 스플래시 스크린 생성 (2732x2732 이미지 필요)
console.log("스플래시 스크린 생성 중...")
if (fs.existsSync(path.join(resourcesDir, "splash.png"))) {
  execSync("npx capacitor-assets generate --splashSource resources/splash.png", { stdio: "inherit" })
} else {
  console.log("resources/splash.png 파일이 필요합니다. 2732x2732 크기의 PNG 파일을 준비해주세요.")
}

console.log("리소스 설정 완료!")
