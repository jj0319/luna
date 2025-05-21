"use client"

import { useState, useEffect } from "react"
import { ENV } from "../config/env"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function EnvSettings() {
  const [apiKey, setApiKey] = useState(ENV.GOOGLE_API_KEY || "")
  const [searchId, setSearchId] = useState(ENV.GOOGLE_ID || "")
  const [isSaved, setIsSaved] = useState(true)

  // 설정 저장 함수
  const saveSettings = () => {
    // 로컬 스토리지에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("luna-google-api-key", apiKey)
      localStorage.setItem("luna-google-search-id", searchId)
    }

    setIsSaved(true)
    toast({
      title: "설정 저장 완료",
      description: "API 키와 검색 ID가 저장되었습니다.",
    })
  }

  // 설정 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApiKey = localStorage.getItem("luna-google-api-key")
      const savedSearchId = localStorage.getItem("luna-google-search-id")

      if (savedApiKey) setApiKey(savedApiKey)
      if (savedSearchId) setSearchId(savedSearchId)
    }
  }, [])

  // 값이 변경되면 저장 상태 업데이트
  useEffect(() => {
    setIsSaved(false)
  }, [apiKey, searchId])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API 설정</CardTitle>
        <CardDescription>Google 검색 API 키와 검색 엔진 ID를 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Google API 키</Label>
          <Input
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Google API 키를 입력하세요"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="search-id">Google 검색 엔진 ID</Label>
          <Input
            id="search-id"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Google 검색 엔진 ID를 입력하세요"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSettings} disabled={isSaved} className="w-full">
          {isSaved ? "저장됨" : "저장"}
        </Button>
      </CardFooter>
    </Card>
  )
}
