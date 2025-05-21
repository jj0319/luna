"use client"

import { useEffect } from "react"

export default function AppLauncher() {
  useEffect(() => {
    // 앱 실행 버튼 클릭 이벤트 처리
    const handleAppLaunch = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      if (target.getAttribute("href")?.startsWith("airesearch://")) {
        e.preventDefault()

        // 현재 플랫폼 감지
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
        const isAndroid = /android/i.test(userAgent)
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream

        // 타임아웃 설정 (앱이 없으면 스토어로 리디렉션)
        const timeout = setTimeout(() => {
          if (isAndroid) {
            window.location.href = "https://play.google.com/store/apps/details?id=com.airesearch.app"
          } else if (isIOS) {
            window.location.href = "https://apps.apple.com/app/airesearch/id123456789"
          }
        }, 2000)

        // 앱 실행 시도
        window.location.href = target.getAttribute("href") || ""

        // 페이지가 숨겨지면 타임아웃 취소 (앱이 실행됨)
        window.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            clearTimeout(timeout)
          }
        })
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener("click", handleAppLaunch)

    // 클린업 함수
    return () => {
      document.removeEventListener("click", handleAppLaunch)
    }
  }, [])

  return null
}
