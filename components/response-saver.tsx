"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ResponseSaverProps {
  question: string
  answer: string
  model: string
  category?: string
}

export function ResponseSaver({ question, answer, model, category = "일반" }: ResponseSaverProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const saveResponse = async () => {
    if (isSaving || isSaved) return

    setIsSaving(true)

    try {
      const response = await fetch("/api/save-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
          model,
          category,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("응답 저장 실패")
      }

      setIsSaved(true)
      toast({
        title: "응답이 저장되었습니다",
        description: "데이터베이스에 응답이 성공적으로 저장되었습니다.",
      })

      // 5초 후 저장 상태 초기화
      setTimeout(() => {
        setIsSaved(false)
      }, 5000)
    } catch (error) {
      console.error("응답 저장 중 오류:", error)
      toast({
        title: "저장 실패",
        description: "응답을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={saveResponse} disabled={isSaving || isSaved} className="ml-auto">
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          저장 중...
        </>
      ) : isSaved ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          저장됨
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          응답 저장
        </>
      )}
    </Button>
  )
}
