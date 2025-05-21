"use client"

import { useState } from "react"

export default function MinimalChat() {
  const [message, setMessage] = useState("")

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">최소 기능 채팅</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[200px]">
        <div className="mb-4">
          <div className="bg-blue-100 p-2 rounded-lg inline-block">안녕하세요! 이것은 최소 기능 채팅입니다.</div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => alert("메시지: " + message)}>
          전송
        </button>
      </div>
    </div>
  )
}
