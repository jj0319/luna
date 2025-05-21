# Luna 애플리케이션 빌드 문제 해결 가이드

## Gradle npmInstall 태스크 오류

`npmInstall` 태스크에서 다음과 같은 오류가 발생하는 경우:

\`\`\`
Execution failed for task ':npmInstall'.
> Process 'command 'C:\Users\...\npm.cmd'' finished with non-zero exit value 1
\`\`\`

### 해결 방법

1. **직접 npm 명령 실행**

   Gradle 대신 직접 npm 명령을 실행하는 배치 파일을 사용합니다:
   
   \`\`\`bash
   build-luna.bat
   \`\`\`

2. **Gradle 직접 실행 태스크 사용**

   node-gradle 플러그인을 우회하는 직접 실행 태스크를 사용합니다:
   
   \`\`\`bash
   gradlew.bat npmInstallDirect
   gradlew.bat buildWindowsAppDirect
   \`\`\`

3. **npm 캐시 정리**

   npm 캐시 문제가 있을 수 있습니다. 다음 명령으로 캐시를 정리합니다:
   
   \`\`\`bash
   npm cache clean --force
   \`\`\`

4. **node_modules 삭제 후 재설치**

   \`\`\`bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   \`\`\`

5. **Gradle 디버그 모드 실행**

   더 자세한 오류 정보를 확인하려면 디버그 모드로 실행합니다:
   
   \`\`\`bash
   gradlew.bat npmInstall --debug
   \`\`\`

6. **Node.js 및 npm 버전 확인**

   Gradle 진단 태스크를 실행하여 Node.js 및 npm 버전을 확인합니다:
   
   \`\`\`bash
   gradlew.bat npmDebug
   \`\`\`

7. **package.json 확인**

   package.json 파일에 문제가 있을 수 있습니다. 파일이 올바른지 확인하세요.

## 기타 문제 해결

### 빌드는 성공했지만 실행 파일이 생성되지 않는 경우

1. 환경 변수 파일이 올바르게 생성되었는지 확인합니다:
   
   \`\`\`bash
   type .env.production
   \`\`\`

2. electron-builder 설정을 확인합니다:
   
   \`\`\`bash
   type electron-builder.yml
   \`\`\`

### 실행 파일이 생성되었지만 실행 시 오류가 발생하는 경우

1. 로그 파일을 확인합니다:
   
   \`\`\`
   %APPDATA%\Luna\logs
   \`\`\`

2. 개발 모드에서 실행하여 오류를 확인합니다:
   
   \`\`\`bash
   npm run electron-dev
   \`\`\`

## 연락처

문제가 계속되면 개발자에게 문의하세요: [이메일 주소]
