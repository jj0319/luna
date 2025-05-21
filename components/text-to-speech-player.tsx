"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Volume2, VolumeX, Settings } from "lucide-react"
import { textToSpeech, type TTSVoice } from "@/lib/text-to-speech"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface TextToSpeechPlayerProps {
  text: string
  autoPlay?: boolean
  showControls?: boolean
  className?: string
}

export function TextToSpeechPlayer({
  text,
  autoPlay = false,
  showControls = true,
  className = "",
}: TextToSpeechPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [volume, setVolume] = useState([1.0])
  const [rate, setRate] = useState([1.0])
  const [pitch, setPitch] = useState([1.0])
  const [voices, setVoices] = useState<TTSVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isSupported, setIsSupported] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // 브라우저 지원 여부 확인
    if (typeof window !== "undefined" && textToSpeech) {
      setIsSupported(textToSpeech.isSupported())

      // 사용 가능한 음성 목록 가져오기
      const availableVoices = textToSpeech.getVoices()
      setVoices(availableVoices)

      // 한국어 음성 찾기
      const koreanVoice = availableVoices.find((voice) => voice.language.includes("ko"))
      if (koreanVoice) {
        setSelectedVoice(koreanVoice.id)
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].id)
      }

      // 자동 재생
      if (autoPlay && text) {
        playText()
      }
    } else {
      setIsSupported(false)
    }

    return () => {
      if (textToSpeech && isPlaying) {
        textToSpeech.stop()
      }
    }
  }, [])

  // 텍스트가 변경되면 재생 중지
  useEffect(() => {
    if (textToSpeech && isPlaying) {
      textToSpeech.stop()
      setIsPlaying(false)
      setIsPaused(false)
    }

    // 자동 재생
    if (autoPlay && text && isSupported) {
      playText()
    }
  }, [text])

  const playText = () => {
    if (!isSupported || !text) return

    if (isPaused) {
      // 일시 중지된 경우 재개
      textToSpeech?.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    // 새로 재생
    const options = {
      voice: selectedVoice,
      rate: rate[0],
      pitch: pitch[0],
      volume: volume[0],
    }

    const success = textToSpeech?.speak(text, options)

    if (success) {
      setIsPlaying(true)
      setIsPaused(false)
    }
  }

  const pauseText = () => {
    if (!isSupported || !isPlaying) return

    textToSpeech?.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const stopText = () => {
    if (!isSupported) return

    textToSpeech?.stop()
    setIsPlaying(false)
    setIsPaused(false)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (textToSpeech) {
      textToSpeech.setDefaultOptions({ volume: value[0] })
    }
  }

  const handleRateChange = (value: number[]) => {
    setRate(value)
    if (textToSpeech) {
      textToSpeech.setDefaultOptions({ rate: value[0] })
    }
  }

  const handlePitchChange = (value: number[]) => {
    setPitch(value)
    if (textToSpeech) {
      textToSpeech.setDefaultOptions({ pitch: value[0] })
    }
  }

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value)

    // 재생 중이면 중지하고 새 음성으로 재생
    if (isPlaying) {
      stopText()
      setTimeout(() => {
        setSelectedVoice(value)
        playText()
      }, 100)
    } else {
      setSelectedVoice(value)
    }
  }

  if (!isSupported) {
    return showControls ? (
      <div className={`text-sm text-muted-foreground ${className}`}>이 브라우저는 음성 합성을 지원하지 않습니다.</div>
    ) : null
  }

  if (!showControls) {
    return (
      <Button variant="outline" size="sm" onClick={isPlaying ? stopText : playText} className={className}>
        {isPlaying ? "읽기 중지" : "텍스트 읽기"}
      </Button>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={isPlaying ? (isPaused ? playText : pauseText) : playText}
          disabled={!text}
          className="h-8 w-8"
        >
          {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleVolumeChange(volume[0] > 0 ? [0] : [1.0])}
            className="h-8 w-8"
          >
            {volume[0] > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Slider value={volume} onValueChange={handleVolumeChange} max={1} step={0.1} className="w-24" />
        </div>

        <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showSettings && (
        <Card className="p-2">
          <CardContent className="p-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select" className="text-xs">
                음성
              </Label>
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger id="voice-select" className="h-8">
                  <SelectValue placeholder="음성 선택" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rate-slider" className="text-xs">
                  속도
                </Label>
                <span className="text-xs">{rate[0].toFixed(1)}x</span>
              </div>
              <Slider id="rate-slider" value={rate} onValueChange={handleRateChange} min={0.5} max={2} step={0.1} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="pitch-slider" className="text-xs">
                  음높이
                </Label>
                <span className="text-xs">{pitch[0].toFixed(1)}</span>
              </div>
              <Slider id="pitch-slider" value={pitch} onValueChange={handlePitchChange} min={0.5} max={2} step={0.1} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
