# Luna 오류 처리 시스템 가이드

이 문서는 Luna 애플리케이션에서 오류를 처리하는 방법에 대한 가이드입니다.

## 목차

1. [개요](#개요)
2. [오류 코드 시스템](#오류-코드-시스템)
3. [오류 처리 방법](#오류-처리-방법)
4. [UI에서 오류 표시](#ui에서-오류-표시)
5. [API 오류 처리](#api-오류-처리)
6. [모범 사례](#모범-사례)

## 개요

Luna 오류 처리 시스템은 애플리케이션 전체에서 일관된 방식으로 오류를 처리하고 표시하기 위해 설계되었습니다. 이 시스템은 다음과 같은 구성 요소로 이루어져 있습니다:

- **오류 코드**: 모든 오류에 고유한 코드 할당
- **오류 처리 유틸리티**: 오류 생성, 변환, 로깅을 위한 함수
- **UI 컴포넌트**: 사용자에게 오류 표시
- **API 오류 처리**: API 응답에서 일관된 오류 형식 제공

## 오류 코드 시스템

오류 코드는 카테고리별로 구성되어 있습니다:

- **1xxx**: 시스템 오류
- **2xxx**: 네트워크 오류
- **3xxx**: 데이터베이스 오류
- **4xxx**: 사용자 입력 오류
- **5xxx**: 인증/권한 오류
- **6xxx**: 외부 서비스 오류
- **7xxx**: 리소스 오류
- **8xxx**: 비즈니스 로직 오류
- **9xxx**: 알 수 없는 오류

각 오류 코드는 다음 정보를 포함합니다:
- 숫자 코드
- 메시지
- 설명
- 심각도
- 제안된 조치

## 오류 처리 방법

### 기본 오류 발생

\`\`\`typescript
import { LunaError } from '@/lib/errors';

// 오류 코드 이름으로 오류 생성
throw new LunaError('NETWORK_CONNECTION_FAILED');

// 추가 정보 포함
throw new LunaError('USER_INPUT_VALIDATION_FAILED', undefined, '이메일 형식이 올바르지 않습니다');

// 기존 오류 래핑
try {
  // 작업 수행
} catch (error) {
  throw new LunaError('DATABASE_QUERY_FAILED', error);
}
\`\`\`

### 비동기 함수에서 오류 처리

\`\`\`typescript
import { withErrorHandling } from '@/lib/errors';

// 비동기 함수 래핑
const result = await withErrorHandling(
  async () => {
    // 비동기 작업 수행
    return await fetchData();
  },
  'NETWORK_GENERAL_ERROR', // 기본 오류 코드
  { userId: '123' } // 컨텍스트 정보
);
\`\`\`

### 동기 함수에서 오류 처리

\`\`\`typescript
import { withSyncErrorHandling } from '@/lib/errors';

// 동기 함수 래핑
const result = withSyncErrorHandling(
  () => {
    // 작업 수행
    return processData();
  },
  'BUSINESS_LOGIC_GENERAL_ERROR'
);
\`\`\`

## UI에서 오류 표시

### 간단한 오류 표시

\`\`\`tsx
import { ErrorDisplay } from '@/components/errors';

function MyComponent() {
  const [error, setError] = useState<Error | null>(null);
  
  // ...
  
  return (
    <div>
      {error && <ErrorDisplay error={error} reset={() => setError(null)} />}
      {/* 나머지 컴포넌트 */}
    </div>
  );
}
\`\`\`

### 오류 경계 사용

\`\`\`tsx
import { ErrorBoundaryWrapper } from '@/components/errors';

function MyApp() {
  return (
    <ErrorBoundaryWrapper>
      <MyComponent />
    </ErrorBoundaryWrapper>
  );
}
\`\`\`

## API 오류 처리

### API 라우트 핸들러 래핑

\`\`\`typescript
import { withApiErrorHandling } from '@/lib/errors';

async function handler(req) {
  // 요청 처리
}

export const GET = withApiErrorHandling(handler);
\`\`\`

### 클라이언트에서 API 오류 처리

\`\`\`typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      const errorData = await response.json();
      throw new LunaError(errorData.error.code);
    }
    return await response.json();
  } catch (error) {
    // 오류 처리
  }
}
\`\`\`

## 모범 사례

1. **구체적인 오류 코드 사용**: 가능한 한 구체적인 오류 코드를 사용하여 문제를 정확히 식별합니다.
2. **컨텍스트 정보 포함**: 오류를 로깅할 때 관련 컨텍스트 정보를 포함합니다.
3. **사용자 친화적인 메시지**: 사용자에게 기술적 세부 사항이 아닌 이해하기 쉬운 메시지를 표시합니다.
4. **복구 옵션 제공**: 가능한 경우 사용자에게 오류에서 복구할 수 있는 방법을 제공합니다.
5. **중요 오류 로깅**: 심각한 오류는 외부 로깅 서비스에 기록하여 모니터링합니다.
