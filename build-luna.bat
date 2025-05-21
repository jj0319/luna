@echo off
echo Luna 애플리케이션 빌드 스크립트
echo ============================

echo 1. 환경 변수 파일 생성 중...
echo GOOGLE_API_KEY=AIzaSyAiFX1mcpCnMgsHqHvp8NJOAGU7ZN4yVDs > .env.production
echo GOOGLE_ID=f4db37719b0144276 >> .env.production
echo 환경 변수 파일 생성 완료

echo 2. npm 패키지 설치 중...
call npm install
if %ERRORLEVEL% neq 0 (
    echo npm install 실패! 오류 코드: %ERRORLEVEL%
    echo 오류 해결 시도 중...
    
    echo 2.1. npm 캐시 정리 시도...
    call npm cache clean --force
    
    echo 2.2. node_modules 삭제 시도...
    if exist node_modules rmdir /s /q node_modules
    
    echo 2.3. package-lock.json 삭제 시도...
    if exist package-lock.json del package-lock.json
    
    echo 2.4. 다시 npm 패키지 설치 시도...
    call npm install
    
    if %ERRORLEVEL% neq 0 (
        echo npm install 재시도 실패! 빌드를 중단합니다.
        exit /b %ERRORLEVEL%
    )
)
echo npm 패키지 설치 완료

echo 3. Next.js 애플리케이션 빌드 중...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Next.js 빌드 실패! 오류 코드: %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)
echo Next.js 애플리케이션 빌드 완료

echo 4. Electron 애플리케이션 빌드 중...
call npm run build-win-exe
if %ERRORLEVEL% neq 0 (
    echo Electron 빌드 실패! 오류 코드: %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)
echo Electron 애플리케이션 빌드 완료

echo ============================
echo Luna 애플리케이션 빌드 성공!
echo 설치 프로그램: dist\Luna-Setup-1.0.0.exe
echo 포터블 버전: dist\Luna-Portable-1.0.0.exe
echo ============================
