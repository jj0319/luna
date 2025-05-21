"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function ResetPersonaButton() {
  const [isResetting, setIsResetting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleReset = async () => {
    if (isResetting) return

    if (!confirm("정말로 모든 인격체를 삭제하고 Luna 인격체만 생성하시겠습니까?")) {
      return
    }

    setIsResetting(true)

    try {
      const response = await fetch("/api/reset-personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "인격체 초기화 성공",
          description: "Luna 인격체만 남고 다른 인격체는 모두 삭제되었습니다.",
          duration: 3000,
        })

        // Refresh the page to see changes
        router.refresh()
      } else {
        toast({
          title: "인격체 초기화 실패",
          description: data.message || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error resetting personas:", error)
      toast({
        title: "인격체 초기화 실패",
        description: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleReset}
      disabled={isResetting}
      className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
    >
      {isResetting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          초기화 중...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Luna만 남기기
        </>
      )}
    </Button>
  )
}
