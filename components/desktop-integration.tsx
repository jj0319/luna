"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DesktopIntegration() {
  const [isElectron, setIsElectron] = useState(false)
  const [appInfo, setAppInfo] = useState<any>({
    NAME: "Luna",
    VERSION: "1.0.0",
    DESCRIPTION: "개인용 AI 연구 및 검색 플랫폼",
    COPYRIGHT: `Copyright © ${new Date().getFullYear()}`,
  })
  const [apiKey, setApiKey] = useState<string>("로컬 환경에서 실행 중")
  const [searchEngineId, setSearchEngineId] = useState<string>("로컬 환경에서 실행 중")

  useEffect(() => {
    // Electron 환경 확인 (window.electronAPI가 있으면 Electron)
    const isElectronEnv = !!(window as any).electronAPI
    setIsElectron(isElectronEnv)

    // 앱 정보 설정
    if (isElectronEnv) {
      // Electron API가 있는 경우 (실제 Electron 환경)
      ;(window as any).electronAPI
        .getAppInfo()
        .then(setAppInfo)
        .catch(() => {
          // 오류 발생 시 기본값 사용
          setAppInfo({
            NAME: "Luna",
            VERSION: "1.0.0",
            DESCRIPTION: "개인용 AI 연구 및 검색 플랫폼",
            COPYRIGHT: `Copyright © ${new Date().getFullYear()}`,
          })
        })
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Luna 데스크톱 애플리케이션</CardTitle>
          <CardDescription>Windows 데스크톱 환경에 최적화된 Luna 애플리케이션입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">애플리케이션 정보</TabsTrigger>
              <TabsTrigger value="api">API 설정</TabsTrigger>
              <TabsTrigger value="system">시스템 정보</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <div className="font-medium">애플리케이션 이름</div>
                <div className="text-sm text-muted-foreground">{appInfo?.NAME || "Luna"}</div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">버전</div>
                <div className="text-sm text-muted-foreground">{appInfo?.VERSION || "1.0.0"}</div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">설명</div>
                <div className="text-sm text-muted-foreground">
                  {appInfo?.DESCRIPTION || "개인용 AI 연구 및 검색 플랫폼"}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">저작권</div>
                <div className="text-sm text-muted-foreground">{appInfo?.COPYRIGHT || "Copyright © 2023"}</div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <div className="font-medium">Google API 키</div>
                <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">{apiKey}</div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">검색 엔진 ID</div>
                <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">{searchEngineId}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                로컬 환경에서는 모의 데이터를 사용하므로 API 키가 필요하지 않습니다.
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <div className="font-medium">플랫폼</div>
                <div className="text-sm text-muted-foreground">Windows</div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">실행 환경</div>
                <div className="text-sm text-muted-foreground">{isElectron ? "Electron" : "웹 브라우저"}</div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Node.js 버전</div>
                <div className="text-sm text-muted-foreground">{(process as any).versions?.node || "N/A"}</div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Electron 버전</div>
                <div className="text-sm text-muted-foreground">{(process as any).versions?.electron || "N/A"}</div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">시스템 정보 새로고침</Button>
          <Button>설정 저장</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
