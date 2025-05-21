# AI 연구 플랫폼 데스크톱 앱 빌드 가이드

이 가이드는 Next.js 프로젝트를 Electron을 사용하여 데스크톱 애플리케이션으로 빌드하는 방법을 설명합니다.

## 사전 요구사항

- Node.js 14 이상
- npm 또는 yarn
- Git

## 설치 방법

1. 저장소 클론:
   \`\`\`
   git clone https://github.com/airesearch/ai-research-platform.git
   cd ai-research-platform
   \`\`\`

2. 의존성 설치:
   \`\`\`
   npm install
   \`\`\`

## 개발 환경에서 실행

개발 모드에서 Electron 앱을 실행하려면:

\`\`\`
npm run electron-dev
\`\`\`

이 명령은 Next.js 개발 서버를 시작하고, 준비되면 Electron 앱을 실행합니다.

## 데스크톱 앱 빌드

프로덕션용 데스크톱 앱을 빌드하려면:

\`\`\`
npm run build-electron
\`\`\`

이 명령은 다음 작업을 수행합니다:
1. Next.js 앱을 빌드하고 정적 파일로 내보냅니다.
2. Electron의 main 및 preload 스크립트를 컴파일합니다.
3. 필요한 리소스 파일을 복사합니다.
4. electron-builder를 사용하여 배포 가능한 패키지를 생성합니다.

빌드된 앱은 `dist` 디렉토리에 생성됩니다.

## 지원되는 플랫폼

- Windows (exe, portable)
- macOS (dmg, zip)
- Linux (AppImage, deb, rpm)

## 자동 업데이트

이 앱은 electron-updater를 사용하여 자동 업데이트를 지원합니다. 
GitHub 릴리스를 통해 업데이트를 배포할 수 있습니다.

## 문제 해결

- **빌드 오류**: Node.js 및 npm 버전이 최신인지 확인하세요.
- **의존성 문제**: `npm ci`를 실행하여 정확한 의존성을 설치하세요.
- **코드 서명 오류**: 코드 서명 인증서가 필요한 경우 electron-builder 설정을 확인하세요.

## 추가 리소스

- [Electron 문서](https://www.electronjs.org/docs)
- [electron-builder 문서](https://www.electron.build/)
- [Next.js 문서](https://nextjs.org/docs)
