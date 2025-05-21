"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Copy, Check, RefreshCw } from "lucide-react"
import { textSummarizer } from "@/lib/summarization"

interface TextSummarizerUIProps {
  className?: string
}

export function TextSummarizerUI({ className = "" }: TextSummarizerUIProps) {
  const [originalText, setOriginalText] = useState("")
  const [summary, setSummary] = useState("")
  const [format, setFormat] = useState<"paragraph" | "bullets">("paragraph")
  const [maxLength, setMaxLength] = useState([150])
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null)

  const handleSummarize = async () => {
    if (!originalText.trim()) {
      setError("요약할 텍스트를 입력해주세요.")
      return
    }

    setError(null)
    setIsSummarizing(true)

    try {
      const result = await textSummarizer.summarize(originalText, {
        maxLength: maxLength[0],
        format,
        language: "ko",
      })

      setSummary(result.summary)
      setCompressionRatio(result.compressionRatio)
    } catch (err) {
      console.error("Summarization error:", err)
      setError("요약 중 오류가 발생했습니다.")
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCopy = () => {
    if (!summary) return

    navigator.clipboard.writeText(summary)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleClearCache = () => {
    textSummarizer.clearCache()
    alert("요약 캐시가 초기화되었습니다.")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI 텍스트 요약</span>
          <Button variant="ghost" size="sm" onClick={handleClearCache} className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            캐시 초기화
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="original-text">원본 텍스트</Label>
          <Textarea
            id="original-text"
            placeholder="요약할 텍스트를 입력하세요..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">요약 형식</Label>
            <Select value={format} onValueChange={(value: "paragraph" | "bullets") => setFormat(value)}>
              <SelectTrigger id="format">
                <SelectValue placeholder="형식 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">문단 형식</SelectItem>
                <SelectItem value="bullets">글머리 기호</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="max-length">최대 길이</Label>
              <span className="text-xs text-muted-foreground">{maxLength[0]}자</span>
            </div>
            <Slider id="max-length" value={maxLength} onValueChange={setMaxLength} min={50} max={300} step={10} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button onClick={handleSummarize} disabled={isSummarizing}>
          {isSummarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : "요약하기"}
        </Button>
        <Button onClick={handleCopy} variant="outline">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
