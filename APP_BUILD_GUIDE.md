# AI 연구 플랫폼 앱 빌드 가이드

이 가이드는 웹 프로젝트를 네이티브 모바일 앱으로 변환하는 방법을 설명합니다.

## 사전 요구사항

- Node.js 14 이상
- Android Studio (안드로이드 앱 빌드용)
- Xcode (iOS 앱 빌드용, Mac OS 필요)
- JDK 11 이상 (안드로이드 빌드용)

## 설치 방법

1. 필요한 패키지 설치:
   \`\`\`
   npm install
   \`\`\`

2. 앱 리소스 준비:
   - `resources/icon.png` 파일 준비 (512x512 PNG)
   - `resources/splash.png` 파일 준비 (2732x2732 PNG)

3. 리소스 생성:
   \`\`\`
   node setup-resources.js
   \`\`\`

4. 앱 빌드:
   \`\`\`
   npm run build-app
   \`\`\`

## 앱 개발 및 테스트

### 안드로이드

1. 안드로이드 스튜디오 열기:
   \`\`\`
   npm run open-android
   \`\`\`

2. 안드로이드 스튜디오에서 앱 실행 또는 APK 빌드

### iOS (Mac OS 필요)

1. Xcode 열기:
   \`\`\`
   npm run open-ios
   \`\`\`

2. Xcode에서 앱 실행 또는 IPA 빌드

## 변경사항 동기화

웹 코드를 수정한 후 앱에 변경사항 반영:

\`\`\`
npm run build
npm run export
npm run sync-app
\`\`\`

## 앱 배포

### 안드로이드

1. 안드로이드 스튜디오에서 서명된 APK 또는 AAB 생성
2. Google Play Console에 업로드

### iOS

1. Xcode에서 Archive 생성
2. App Store Connect에 업로드

## 문제 해결

- 빌드 오류 발생 시 `npx cap doctor`로 환경 진단
- iOS 빌드 문제는 Xcode 버전 확인
- 안드로이드 빌드 문제는 Gradle 및 JDK 버전 확인
