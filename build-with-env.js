const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

try {
  // config/env.ts 파일에서 환경 변수 가져오기 (빌드 후 생성된 js 파일)
  const envConfigPath = path.resolve(__dirname, "dist/config/env.js")

  // 먼저 TypeScript 컴파일
  console.log("TypeScript 컴파일 중...")
  execSync("tsc config/env.ts --outDir dist", { stdio: "inherit" })

  // 컴파일된 파일이 존재하는지 확인
  if (!fs.existsSync(envConfigPath)) {
    throw new Error("환경 변수 설정 파일을 찾을 수 없습니다.")
  }

  // Next.js 빌드
  console.log("Next.js 애플리케이션 빌드 중...")
  execSync("next build", { stdio: "inherit" })

  // Electron 빌드
  console.log("Electron 애플리케이션 빌드 중...")
  execSync("tsc -p tsconfig.electron.json", { stdio: "inherit" })

  // Windows 전용 빌드
  console.log("Windows 애플리케이션 패키징 중...")
  execSync("electron-builder --win --config electron-builder.yml", { stdio: "inherit" })

  console.log("빌드 완료! dist 폴더에서 설치 파일을 확인하세요.")
} catch (error) {
  console.error("빌드 중 오류가 발생했습니다:", error)
  process.exit(1)
}
