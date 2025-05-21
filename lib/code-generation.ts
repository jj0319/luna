"use client"

/**
 * Code Generation System
 *
 * 자연어 설명을 기반으로 코드를 생성하는 기능을 제공합니다.
 */

export interface CodeGenerationOptions {
  language: string
  framework?: string
  comments?: boolean
  style?: "concise" | "verbose"
}

export interface CodeGenerationResult {
  code: string
  language: string
  explanation?: string
}

export class CodeGenerator {
  private supportedLanguages: string[] = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c#",
    "c++",
    "go",
    "rust",
    "php",
    "ruby",
    "swift",
    "kotlin",
    "html",
    "css",
    "sql",
  ]

  private supportedFrameworks: Record<string, string[]> = {
    javascript: ["react", "vue", "angular", "node", "express", "next.js"],
    typescript: ["react", "vue", "angular", "node", "express", "next.js"],
    python: ["django", "flask", "fastapi", "pytorch", "tensorflow"],
    java: ["spring", "android"],
    "c#": [".net", "asp.net", "unity"],
    php: ["laravel", "symfony"],
    ruby: ["rails"],
    swift: ["ios", "swiftui"],
    kotlin: ["android"],
  }

  private codeTemplates: Record<string, string> = {
    javascript: 'function example() {\n  // TODO: Implement\n  console.log("Hello, world!");\n}',
    typescript: 'function example(): void {\n  // TODO: Implement\n  console.log("Hello, world!");\n}',
    python: 'def example():\n    # TODO: Implement\n    print("Hello, world!")',
    java: 'public class Example {\n    public static void main(String[] args) {\n        // TODO: Implement\n        System.out.println("Hello, world!");\n    }\n}',
    "c#": 'using System;\n\nclass Example {\n    static void Main() {\n        // TODO: Implement\n        Console.WriteLine("Hello, world!");\n    }\n}',
    html: "<!DOCTYPE html>\n<html>\n<head>\n    <title>Example</title>\n</head>\n<body>\n    <h1>Hello, world!</h1>\n</body>\n</html>",
    css: "body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}",
    sql: "SELECT * FROM users WHERE active = true;",
  }

  private frameworkTemplates: Record<string, Record<string, string>> = {
    javascript: {
      react:
        'import React from "react";\n\nfunction ExampleComponent() {\n  return (\n    <div>\n      <h1>Hello, world!</h1>\n    </div>\n  );\n}\n\nexport default ExampleComponent;',
      vue: '<template>\n  <div>\n    <h1>Hello, world!</h1>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: "ExampleComponent"\n}\n</script>',
      express:
        'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello, world!");\n});\n\napp.listen(3000, () => {\n  console.log("Server running on port 3000");\n});',
    },
    typescript: {
      react:
        'import React from "react";\n\ninterface Props {\n  name?: string;\n}\n\nconst ExampleComponent: React.FC<Props> = ({ name = "world" }) => {\n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n    </div>\n  );\n};\n\nexport default ExampleComponent;',
      "next.js":
        'import type { NextPage } from "next";\n\nconst Home: NextPage = () => {\n  return (\n    <div>\n      <h1>Hello, world!</h1>\n    </div>\n  );\n};\n\nexport default Home;',
    },
    python: {
      django: 'from django.http import HttpResponse\n\ndef index(request):\n    return HttpResponse("Hello, world!")',
      flask:
        'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return "Hello, world!"',
    },
  }

  /**
   * 코드 생성
   */
  public async generateCode(prompt: string, options: CodeGenerationOptions): Promise<CodeGenerationResult> {
    // 언어 확인
    if (!this.supportedLanguages.includes(options.language)) {
      throw new Error(`지원하지 않는 언어입니다: ${options.language}`)
    }

    // 프레임워크 확인
    if (
      options.framework &&
      (!this.supportedFrameworks[options.language] ||
        !this.supportedFrameworks[options.language].includes(options.framework))
    ) {
      throw new Error(`${options.language}에서 지원하지 않는 프레임워크입니다: ${options.framework}`)
    }

    try {
      // 실제 구현에서는 AI 모델을 호출하여 코드 생성
      // 여기서는 간단한 템플릿 기반 구현
      const code = this.generateCodeFromTemplate(prompt, options)

      return {
        code,
        language: options.language,
        explanation: options.comments ? this.generateExplanation(code, options.language) : undefined,
      }
    } catch (error) {
      console.error("Code generation error:", error)
      throw error
    }
  }

  /**
   * 템플릿 기반 코드 생성
   */
  private generateCodeFromTemplate(prompt: string, options: CodeGenerationOptions): string {
    const { language, framework, comments, style } = options

    // 프롬프트에서 키워드 추출
    const keywords = this.extractKeywords(prompt)

    // 기본 템플릿 가져오기
    let template = ""

    if (framework && this.frameworkTemplates[language] && this.frameworkTemplates[language][framework]) {
      template = this.frameworkTemplates[language][framework]
    } else if (this.codeTemplates[language]) {
      template = this.codeTemplates[language]
    } else {
      template = "// Generated code for " + language
    }

    // 프롬프트 기반 코드 생성
    let code = this.customizeTemplate(template, prompt, keywords, language, framework)

    // 주석 추가
    if (comments) {
      code = this.addComments(code, prompt, language)
    }

    // 스타일 적용
    if (style === "verbose") {
      code = this.makeVerbose(code, language)
    } else if (style === "concise") {
      code = this.makeConcise(code, language)
    }

    return code
  }

  /**
   * 프롬프트에서 키워드 추출
   */
  private extractKeywords(prompt: string): string[] {
    // 간단한 키워드 추출 로직
    const words = prompt.toLowerCase().split(/\s+/)
    const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"]

    return words
      .filter((word) => word.length > 2 && !stopWords.includes(word))
      .map((word) => word.replace(/[^\w]/g, ""))
  }

  /**
   * 템플릿 커스터마이징
   */
  private customizeTemplate(
    template: string,
    prompt: string,
    keywords: string[],
    language: string,
    framework?: string,
  ): string {
    // 프롬프트에서 함수/클래스 이름 추출 시도
    const nameMatch = prompt.match(/(?:function|class|component|app|create|make|build)\s+(\w+)/i)
    const name = nameMatch ? nameMatch[1] : "Example"

    // 템플릿 커스터마이징
    let code = template

    // 이름 교체
    code = code.replace(/Example/g, name)
    code = code.replace(/example/g, name.toLowerCase())

    // TODO 주석 교체
    code = code.replace(/\/\/ TODO: Implement/g, `// ${prompt}`)
    code = code.replace(/# TODO: Implement/g, `# ${prompt}`)

    // 프롬프트에 따라 간단한 구현 추가
    if (prompt.includes("list") || prompt.includes("array")) {
      if (language === "javascript" || language === "typescript") {
        code = code.replace(
          /console\.log$$"Hello, world!"$$;/,
          `const items = ["Item 1", "Item 2", "Item 3"];\n  items.forEach(item => console.log(item));`,
        )
      } else if (language === "python") {
        code = code.replace(
          /print$$"Hello, world!"$$/,
          `items = ["Item 1", "Item 2", "Item 3"]\n    for item in items:\n        print(item)`,
        )
      }
    }

    if (prompt.includes("api") || prompt.includes("fetch") || prompt.includes("http")) {
      if (language === "javascript" || language === "typescript") {
        if (framework === "react") {
          code = code.replace(/<h1>Hello, world!<\/h1>/, `<h1>API Data</h1>\n      <div id="data">Loading...</div>`)
          code = code.replace(
            /function ExampleComponent$$$$ {/,
            `function ExampleComponent() {\n  const [data, setData] = React.useState(null);\n\n  React.useEffect(() => {\n    fetch('https://api.example.com/data')\n      .then(response => response.json())\n      .then(data => setData(data));\n  }, []);\n`,
          )
        }
      }
    }

    return code
  }

  /**
   * 주석 추가
   */
  private addComments(code: string, prompt: string, language: string): string {
    // 언어별 주석 스타일
    const commentStart = language === "python" ? "# " : "// "
    const commentEnd = ""

    // 파일 상단에 주석 추가
    const headerComment = `${commentStart}${prompt}${commentEnd}\n`

    return headerComment + code
  }

  /**
   * 상세한 스타일로 변경
   */
  private makeVerbose(code: string, language: string): string {
    // 언어별 주석 스타일
    const commentStart = language === "python" ? "# " : "// "

    // 줄 단위로 분리
    const lines = code.split("\n")
    const verboseLines = []

    // 각 줄에 설명 추가
    for (const line of lines) {
      verboseLines.push(line)

      // 의미 있는 줄에만 설명 추가
      if (line.trim() && !line.trim().startsWith(commentStart.trim())) {
        const explanation = this.generateLineExplanation(line, language)
        if (explanation) {
          verboseLines.push(`${commentStart}${explanation}`)
        }
      }
    }

    return verboseLines.join("\n")
  }

  /**
   * 간결한 스타일로 변경
   */
  private makeConcise(code: string, language: string): string {
    // 언어별 주석 스타일
    const commentStart = language === "python" ? "# " : "// "

    // 주석 제거
    const lines = code.split("\n")
    const conciseLines = lines.filter((line) => !line.trim().startsWith(commentStart.trim()))

    // 빈 줄 최소화
    let result = ""
    let emptyLineCount = 0

    for (const line of conciseLines) {
      if (line.trim() === "") {
        if (emptyLineCount < 1) {
          result += "\n"
          emptyLineCount++
        }
      } else {
        result += line + "\n"
        emptyLineCount = 0
      }
    }

    return result.trim()
  }

  /**
   * 코드 줄 설명 생성
   */
  private generateLineExplanation(line: string, language: string): string {
    // 간단한 설명 생성 로직
    if (line.includes("function") || line.includes("def ")) {
      return "함수 정의"
    } else if (line.includes("class")) {
      return "클래스 정의"
    } else if (line.includes("return")) {
      return "결과값 반환"
    } else if (line.includes("if ")) {
      return "조건 검사"
    } else if (line.includes("for ") || line.includes("forEach")) {
      return "반복 처리"
    } else if (line.includes("import ") || line.includes("require")) {
      return "모듈 가져오기"
    } else if (line.includes("=") && !line.includes("==")) {
      return "변수 할당"
    } else if (line.includes("console.log") || line.includes("print")) {
      return "콘솔에 출력"
    }

    return ""
  }

  /**
   * 코드 설명 생성
   */
  private generateExplanation(code: string, language: string): string {
    // 간단한 설명 생성
    const lines = code.split("\n").length
    const hasFunction = code.includes("function") || code.includes("def ")
    const hasClass = code.includes("class")
    const hasLoop = code.includes("for ") || code.includes("while ") || code.includes("forEach")
    const hasCondition = code.includes("if ") || code.includes("switch")

    let explanation = `이 코드는 ${language} 언어로 작성된 ${lines}줄의 코드입니다.\n\n`

    if (hasClass) {
      explanation += "클래스를 정의하고 있으며, "
    }

    if (hasFunction) {
      explanation += "함수를 포함하고 있습니다. "
    }

    if (hasLoop) {
      explanation += "반복문을 사용하여 데이터를 처리합니다. "
    }

    if (hasCondition) {
      explanation += "조건문을 통해 다양한 상황을 처리합니다. "
    }

    return explanation
  }

  /**
   * 지원하는 언어 목록 가져오기
   */
  public getSupportedLanguages(): string[] {
    return [...this.supportedLanguages]
  }

  /**
   * 언어별 지원하는 프레임워크 목록 가져오기
   */
  public getSupportedFrameworks(language: string): string[] {
    return this.supportedFrameworks[language] || []
  }
}

// 싱글톤 인스턴스 생성
export const codeGenerator = new CodeGenerator()
