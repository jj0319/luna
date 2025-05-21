"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { speechRecognizer } from "@/lib/speech-recognition"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VoiceInputProps {
  onResult: (text: string) => void
  language?: string
  className?: string
  buttonOnly?: boolean
}

export function VoiceInput({ onResult, language = "ko-KR", className = "", buttonOnly = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 브라우저 지원 여부 확인
    if (typeof window !== "undefined" && speechRecognizer) {
      setIsSupported(speechRecognizer.isSupported())

      // 결과 콜백 설정
      speechRecognizer.onResult((result) => {
        setTranscript(result.text)
        if (result.isFinal) {
          onResult(result.text)
          setIsListening(false)
        }
      })

      // 에러 콜백 설정
      speechRecognizer.onError((error) => {
        console.error("Speech recognition error:", error)
        setError("음성 인식 중 오류가 발생했습니다.")
        setIsListening(false)
      })

      // 종료 콜백 설정
      speechRecognizer.onEnd(() => {
        setIsListening(false)
      })

      // 언어 설정
      if (language) {
        speechRecognizer.setLanguage(language)
      }
    } else {
      setIsSupported(false)
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (speechRecognizer && isListening) {
        speechRecognizer.stop()
      }
    }
  }, [onResult, language])

  const toggleListening = () => {
    if (!isSupported) {
      setError("이 브라우저는 음성 인식을 지원하지 않습니다.")
      return
    }

    if (isListening) {
      speechRecognizer?.stop()
      setIsListening(false)
    } else {
      setError(null)
      setTranscript("")
      const started = speechRecognizer?.start({ language })

      if (started) {
        setIsListening(true)
      } else {
        setError("음성 인식을 시작할 수 없습니다.")
      }
    }
  }

  if (!isSupported && !buttonOnly) {
    return (
      <Alert className={className}>
        <AlertDescription>
          이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 브라우저를 사용해보세요.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={!isSupported}
        className="rounded-full"
        title={isListening ? "음성 인식 중지" : "음성으로 입력"}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      {!buttonOnly && (
        <>
          {isListening && (
            <Badge variant="outline" className="animate-pulse flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>음성 인식 중...</span>
            </Badge>
          )}

          {transcript && <span className="text-sm text-muted-foreground">{transcript}</span>}

          {error && <span className="text-sm text-destructive">{error}</span>}
        </>
      )}
    </div>
  )
}
