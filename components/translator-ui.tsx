"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Languages, ArrowRightLeft, Copy, Check } from "lucide-react"
import { translator } from "@/lib/translation"
import { TextToSpeechPlayer } from "@/components/text-to-speech-player"

interface TranslatorUIProps {
  apiKey?: string
  className?: string
}

export function TranslatorUI({ apiKey, className = "" }: TranslatorUIProps) {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("auto")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // API 키 설정
  if (apiKey) {
    translator.setApiKey(apiKey)
  }

  // 지원하는 언어 목록
  const languages = Array.from(translator.getSupportedLanguages().entries())

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("번역할 텍스트를 입력해주세요.")
      return
    }

    setError(null)
    setIsTranslating(true)

    try {
      const result = await translator.translate(sourceText, {
        sourceLanguage: sourceLanguage === "auto" ? undefined : sourceLanguage,
        targetLanguage,
      })

      setTranslatedText(result.translatedText)
    } catch (err) {
      console.error("Translation error:", err)
      setError("번역 중 오류가 발생했습니다.")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwapLanguages = () => {
    if (sourceLanguage === "auto") {
      // 자동 감지는 교체할 수 없음
      return
    }

    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)

    // 텍스트도 교체
    if (translatedText) {
      setSourceText(translatedText)
      setTranslatedText("")
    }
  }

  const handleCopy = () => {
    if (!translatedText) return

    navigator.clipboard.writeText(translatedText)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 번역기</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-[45%]">
            <Label htmlFor="source-language">원본 언어</Label>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger id="source-language">
                <SelectValue placeholder="원본 언어 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">자동 감지</SelectItem>
                {languages.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapLanguages}
            disabled={sourceLanguage === "auto"}
            className="mt-6"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="w-[45%]">
            <Label htmlFor="target-language">목표 언어</Label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger id="target-language">
                <SelectValue placeholder="목표 언어 선택" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="source-text">번역할 텍스트</Label>
            <Textarea
              id="source-text"
              placeholder="번역할 텍스트를 입력하세요..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[200px]"
            />
            {sourceText && (
              <div className="flex justify-end">
                <TextToSpeechPlayer text={sourceText} showControls={false} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="translated-text">번역 결과</Label>
            <Textarea
              id="translated-text"
              placeholder="번역 결과가 여기에 표시됩니다..."
              value={translatedText}
              readOnly
              className="min-h-[200px]"
            />
            {translatedText && (
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      복사하기
                    </>
                  )}
                </Button>

                <TextToSpeechPlayer text={translatedText} showControls={false} />
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}
      </CardContent>

      <CardFooter>
        <Button onClick={handleTranslate} disabled={isTranslating || !sourceText.trim()} className="w-full">
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              번역 중...
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-2" />
              번역하기
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
