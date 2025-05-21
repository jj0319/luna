"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 데이터 타입 정의
export type Response = {
  id: string
  question: string
  answer: string
  model: string
  timestamp: string
  category: string
  feedback: string
}

export const columns: ColumnDef<Response>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          질문
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const question = row.getValue("question") as string
      return <div className="max-w-[300px] truncate">{question}</div>
    },
  },
  {
    accessorKey: "answer",
    header: "응답",
    cell: ({ row }) => {
      const answer = row.getValue("answer") as string
      return <div className="max-w-[300px] truncate">{answer}</div>
    },
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          모델
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          시간
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string
      const formatted = new Date(timestamp).toLocaleString()
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "category",
    header: "카테고리",
  },
  {
    accessorKey: "feedback",
    header: "피드백",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const response = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>작업</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(response.answer)}>
              응답 복사
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>상세 보기</DropdownMenuItem>
            <DropdownMenuItem>수정</DropdownMenuItem>
            <DropdownMenuItem>삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
