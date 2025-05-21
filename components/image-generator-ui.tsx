"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, ImageIcon, Download, Trash2 } from "lucide-react"
import { imageGenerator, type GeneratedImage, type ImageGenerationOptions } from "@/lib/image-generation"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ImageGeneratorUIProps {
  apiKey?: string
  className?: string
}

export function ImageGeneratorUI({ apiKey, className = "" }: ImageGeneratorUIProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")
  const [options, setOptions] = useState<ImageGenerationOptions>({
    width: 512,
    height: 512,
    style: "vivid",
  })

  // API 키 설정
  if (apiKey) {
    imageGenerator.setApiKey(apiKey)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("이미지 생성을 위한 프롬프트를 입력해주세요.")
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      const result = await imageGenerator.generateImage(prompt, options)

      if (result) {
        setCurrentImage(result)
      } else {
        setError("이미지 생성에 실패했습니다.")
      }
    } catch (err) {
      console.error("Image generation error:", err)
      setError("이미지 생성 중 오류가 발생했습니다.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!currentImage) return

    // 이미지 다운로드
    const link = document.createElement("a")
    link.href = currentImage.url
    link.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSelectFromHistory = (image: GeneratedImage) => {
    setCurrentImage(image)
    setPrompt(image.prompt)
    setActiveTab("generate")
  }

  const handleClearHistory = () => {
    if (confirm("정말로 모든 이미지 기록을 삭제하시겠습니까?")) {
      imageGenerator.clearHistory()
      setActiveTab("generate")
    }
  }

  const handleOptionChange = (key: keyof ImageGenerationOptions, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 이미지 생성</CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="generate">이미지 생성</TabsTrigger>
          <TabsTrigger value="history">생성 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">이미지 프롬프트</Label>
              <Textarea
                id="prompt"
                placeholder="생성하고 싶은 이미지를 자세히 설명해주세요..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">너비</Label>
                <Select
                  value={options.width?.toString()}
                  onValueChange={(value) => handleOptionChange("width", Number.parseInt(value))}
                >
                  <SelectTrigger id="width">
                    <SelectValue placeholder="너비 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256">256px</SelectItem>
                    <SelectItem value="512">512px</SelectItem>
                    <SelectItem value="768">768px</SelectItem>
                    <SelectItem value="1024">1024px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">높이</Label>
                <Select
                  value={options.height?.toString()}
                  onValueChange={(value) => handleOptionChange("height", Number.parseInt(value))}
                >
                  <SelectTrigger id="height">
                    <SelectValue placeholder="높이 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256">256px</SelectItem>
                    <SelectItem value="512">512px</SelectItem>
                    <SelectItem value="768">768px</SelectItem>
                    <SelectItem value="1024">1024px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">스타일</Label>
              <Select value={options.style} onValueChange={(value) => handleOptionChange("style", value)}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="스타일 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vivid">생생한 (Vivid)</SelectItem>
                  <SelectItem value="natural">자연스러운 (Natural)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            {currentImage && (
              <div className="flex flex-col items-center space-y-2">
                <div className="relative border rounded-md overflow-hidden">
                  <img
                    src={currentImage.url || "/placeholder.svg"}
                    alt={currentImage.prompt}
                    className="max-w-full h-auto"
                    style={{ maxHeight: "300px" }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    다운로드
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  이미지 생성하기
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="history">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">생성된 이미지 기록</h3>
              <Button variant="outline" size="sm" onClick={handleClearHistory}>
                <Trash2 className="h-4 w-4 mr-1" />
                기록 삭제
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4">
                {imageGenerator.getHistory().map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-md overflow-hidden cursor-pointer hover:border-primary"
                    onClick={() => handleSelectFromHistory(image)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.prompt}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs truncate">{image.prompt}</p>
                      <p className="text-xs text-muted-foreground">{new Date(image.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                {imageGenerator.getHistory().length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">생성된 이미지가 없습니다.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
