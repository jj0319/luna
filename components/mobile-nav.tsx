"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  {
    title: "홈",
    href: "/",
  },
  {
    title: "AI 채팅",
    href: "/chat",
  },
  {
    title: "검색 통합 채팅",
    href: "/search",
  },
  {
    title: "자가 학습 채팅",
    href: "/self-learning",
  },
  {
    title: "신경망 학습 채팅",
    href: "/neural-learning",
  },
  {
    title: "고급 AI 채팅",
    href: "/advanced-ai",
  },
  {
    title: "사고 처리기",
    href: "/thought-processor",
  },
  {
    title: "신경망 시각화",
    href: "/neural-network",
  },
  {
    title: "모델 다운로드",
    href: "/model-download",
  },
  {
    title: "데이터베이스",
    href: "/database",
  },
  {
    title: "대시보드",
    href: "/dashboard",
  },
  {
    title: "통합 AI 플랫폼",
    href: "/unified-ai",
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle>AI 연구 플랫폼</SheetTitle>
          <SheetDescription>모든 AI 기능에 접근하세요</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-2 py-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                pathname === route.href ? "bg-muted font-medium text-primary" : "hover:bg-muted",
              )}
              onClick={() => setOpen(false)}
            >
              {route.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
