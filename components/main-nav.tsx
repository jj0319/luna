"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold">AI Hub</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>AI 시스템</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/oracle"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">ORACLE</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        통합 AI 시스템으로 다양한 AI 기술을 결합한 고급 인지 엔진
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/chat" title="AI 챗봇">
                  기본 AI 대화 인터페이스
                </ListItem>
                <ListItem href="/personas" title="AI 페르소나">
                  다양한 성격과 특성을 가진 AI 인격체
                </ListItem>
                <ListItem href="/ai-hub" title="AI 허브">
                  다양한 AI 기능을 한곳에서 사용
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>기능</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/search" title="검색">
                  지능형 검색 기능
                </ListItem>
                <ListItem href="/knowledge-graph" title="지식 그래프">
                  연결된 지식 네트워크
                </ListItem>
                <ListItem href="/neural-network" title="신경망">
                  신경망 시각화 및 학습
                </ListItem>
                <ListItem href="/self-learning" title="자기 학습">
                  지속적으로 학습하는 AI 시스템
                </ListItem>
                <ListItem href="/thought-processor" title="사고 처리기">
                  AI의 사고 과정 시각화
                </ListItem>
                <ListItem href="/code-generation" title="코드 생성">
                  AI 기반 코드 생성
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>대시보드</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/ai-status" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>시스템 상태</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
