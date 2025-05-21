# Luna

개인용 통합 AI 플랫폼

## 소개

Luna는 Google 검색 API와 AI 기능을 통합한 개인용 데스크톱 애플리케이션입니다. 검색, 대화, 정보 관리를 하나의 인터페이스에서 처리할 수 있습니다.

## 주요 기능

- Google 검색 API 통합
- 대화형 AI 인터페이스
- 검색 결과와 대화 내용 통합 관리
- 로컬 데이터 저장 및 관리
- 데스크톱 애플리케이션 (.exe)

## 설치 및 실행

### 사전 요구사항

- Node.js 14 이상
- npm 또는 yarn
- Google API 키 및 검색 엔진 ID

### 개발 환경 설정

1. 저장소 클론:
   \`\`\`
   git clone https://github.com/yourusername/luna.git
   cd luna
   \`\`\`

2. 의존성 설치:
   \`\`\`
   npm install
   \`\`\`

3. 환경 변수 설정:
   `.env.production` 파일 생성 후 다음 내용 추가:
   \`\`\`
   GOOGLE_API_KEY=your_api_key
   GOOGLE_ID=your_search_engine_id
   \`\`\`

4. 개발 모드 실행:
   \`\`\`
   npm run electron-dev
   \`\`\`

### 빌드 및 배포

Windows 실행 파일(.exe) 생성:
\`\`\`
npm run build-win-exe
\`\`\`

생성된 파일은 `dist` 폴더에서 확인할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## Google Custom Search API Integration

A Spring Boot application that integrates with the Google Custom Search API.

## Prerequisites

- Java 17 or higher
- Gradle 7.0 or higher
- Google API Key
- Google Custom Search Engine ID

## Running the Application

### Using Gradle

\`\`\`bash
# Set environment variables
export GOOGLE_API_KEY=your_api_key
export GOOGLE_CX=your_cx_id

# Build and run the application
./gradlew bootRun
\`\`\`

### Using Docker

\`\`\`bash
# Set environment variables
export GOOGLE_API_KEY=your_api_key
export GOOGLE_CX=your_cx_id

# Build and run with Docker Compose
docker-compose up -d
\`\`\`

## Accessing the Application

- Web Interface: http://localhost:8080
- Search API: http://localhost:8080/api/search?query=your_query
- Diagnostics: http://localhost:8080/diagnostics

## Features

- Web-based search interface
- REST API for programmatic access
- Diagnostic tools for troubleshooting
- Integration with AI systems
