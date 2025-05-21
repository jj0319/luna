"use client"

import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native"

const App = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "안녕하세요! 통합 AI 플랫폼에 오신 것을 환영합니다. 질문이나 요청사항이 있으시면 말씀해주세요.",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (!input.trim()) return

    // 사용자 메시지 추가
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: "죄송합니다만, 현재 AI 응답 기능은 개발 중입니다. 곧 서비스를 제공해 드리겠습니다.",
        timestamp: new Date(),
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 연구 플랫폼</Text>
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[styles.messageBubble, message.role === "user" ? styles.userMessage : styles.aiMessage]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.messageRole}>
                {message.role === "user" ? "사용자" : message.role === "system" ? "시스템" : "AI 어시스턴트"}
              </Text>
              <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
            </View>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4f46e5" />
            <Text style={styles.loadingText}>AI가 응답을 생성하는 중...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.disabledButton]}
          onPress={handleSendMessage}
          disabled={!input.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#4f46e5",
    alignSelf: "flex-end",
  },
  aiMessage: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageRole: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  messageContent: {
    fontSize: 16,
    color: "#ffffff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4f46e5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a5b4fc",
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default App
