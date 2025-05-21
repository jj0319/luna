# Luna 애플리케이션 Gradle 빌드 가이드

이 문서는 Gradle을 사용하여 Luna 애플리케이션을 빌드하는 방법을 설명합니다.

## 요구사항

- JDK 11 이상
- 인터넷 연결 (Node.js 및 npm 패키지 다운로드용)

## 빌드 방법

### Windows 애플리케이션 빌드

\`\`\`bash
# Gradle Wrapper를 사용하여 빌드
./gradlew buildWindowsApp

# 또는 Windows에서
gradlew.bat buildWindowsApp
\`\`\`

빌드된 애플리케이션은 `dist` 디렉토리에 생성됩니다:
- 설치 프로그램: `dist/Luna-Setup-1.0.0.exe`
- 포터블 버전: `dist/Luna-Portable-1.0.0.exe`

### 개발 모드에서 실행

\`\`\`bash
./gradlew runElectronDev

# 또는 Windows에서
gradlew.bat runElectronDev
\`\`\`

### 빌드 디렉토리 정리

\`\`\`bash
./gradlew clean

# 또는 Windows에서
gradlew.bat clean
\`\`\`

## 사용 가능한 태스크

- `createEnvFile`: 환경 변수 파일(.env.production) 생성
- `buildNextApp`: Next.js 애플리케이션 빌드
- `buildWindowsApp`: Windows 실행 파일 빌드
- `runElectronDev`: 개발 모드에서 Electron 실행
- `clean`: 빌드 디렉토리 정리

## 환경 변수 설정

환경 변수는 `build.gradle` 파일에서 직접 설정할 수 있습니다:

```groovy
def googleApiKey = 'YOUR_API_KEY'
def googleId = 'YOUR_SEARCH_ENGINE_ID'
