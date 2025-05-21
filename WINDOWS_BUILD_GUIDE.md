# Luna Windows 빌드 가이드

이 가이드는 Luna 애플리케이션을 Windows .exe 파일로 빌드하는 방법을 설명합니다.

## 사전 요구사항

- Node.js 14 이상
- npm 또는 yarn
- Git
- Windows 환경 (Windows 10 이상 권장)
- Visual Studio Build Tools (Windows 네이티브 모듈 빌드에 필요)

## 빌드 준비

1. Visual Studio Build Tools 설치
   - [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)를 다운로드하고 설치합니다.
   - 설치 시 "Desktop development with C++" 워크로드를 선택합니다.

2. 프로젝트 클론 및 의존성 설치
   \`\`\`
   git clone https://github.com/your-repo/luna.git
   cd luna
   npm install
   \`\`\`

## Windows .exe 파일 빌드

다음 명령어를 실행하여 Windows .exe 파일을 빌드합니다:

\`\`\`
npm run build-windows
\`\`\`

빌드가 완료되면 `dist` 디렉토리에 다음 파일이 생성됩니다:
- `Luna-Setup-1.0.0.exe`: 설치 프로그램
- `Luna-Portable-1.0.0.exe`: 포터블 버전 (설치 없이 실행 가능)

## 문제 해결

### 빌드 오류

1. **'electron-builder' is not recognized as an internal or external command**
   - 전역으로 electron-builder 설치: `npm install -g electron-builder`
   - 또는 npx 사용: `npx electron-builder --win --x64`

2. **Node Gyp 오류**
   - Windows Build Tools 재설치: `npm install --global --production windows-build-tools`
   - Node.js 버전 확인 (LTS 버전 권장)

3. **코드 서명 관련 오류**
   - 개발용으로는 코드 서명 없이 빌드: `electron-builder --win --x64 --publish never`
   - 배포용으로는 코드 서명 인증서 필요

4. **DLL 누락 오류**
   - Visual C++ 재배포 가능 패키지 설치 확인
   - 최신 Windows 업데이트 적용

### 배포 시 고려사항

1. **코드 서명**
   - 배포용 빌드는 코드 서명을 권장합니다.
   - 코드 서명이 없으면 Windows SmartScreen 경고가 표시될 수 있습니다.

2. **자동 업데이트**
   - electron-updater를 사용하여 자동 업데이트 구현 가능
   - GitHub Releases 또는 자체 서버를 통해 업데이트 배포

## 추가 리소스

- [Electron Builder 문서](https://www.electron.build/)
- [Electron 패키징 가이드](https://www.electronjs.org/docs/tutorial/application-packaging)
- [Windows 코드 서명 가이드](https://www.electronjs.org/docs/tutorial/code-signing)
