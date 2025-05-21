import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Luna - 개인용 AI 어시스턴트",
  description: "웹 검색, 신경망, 자가 학습, 데이터베이스가 통합된 개인용 AI 어시스턴트",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
              <div className="mr-4 hidden md:flex">
                <h1 className="text-xl font-bold">Luna</h1>
              </div>
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
