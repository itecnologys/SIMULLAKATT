"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatComparison() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        'Hello! I can help you compare your investment with other assets. Try asking something like "How does my investment compare to gold over the last year?" or "Show me a comparison with S&P 500."',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Sample responses based on keywords
    let responseContent = ""

    if (input.toLowerCase().includes("gold")) {
      responseContent =
        "Based on my analysis, your investment of €2,000 would have grown to €2,876.54 (43.83% increase) over the past year. In comparison, gold has increased by 12.3% in the same period. Your investment has outperformed gold by 31.53%."
    } else if (
      input.toLowerCase().includes("s&p") ||
      input.toLowerCase().includes("sp500") ||
      input.toLowerCase().includes("s&p 500")
    ) {
      responseContent =
        "Your investment of €2,000 has grown to €2,876.54 (43.83% increase) over the past year. The S&P 500 has increased by 18.7% during the same period. Your investment has outperformed the S&P 500 by 25.13%."
    } else if (input.toLowerCase().includes("bitcoin") || input.toLowerCase().includes("crypto")) {
      responseContent =
        "Your investment of €2,000 has grown to €2,876.54 (43.83% increase) over the past year. Bitcoin has increased by 65.2% during the same period. Bitcoin has outperformed your investment by 21.37%."
    } else {
      responseContent =
        "I've analyzed your investment of €2,000 which has grown to €2,876.54 (43.83% increase). This represents a solid performance compared to many traditional assets. Would you like me to compare it with a specific asset like gold, S&P 500, or Bitcoin?"
    }

    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Investment Comparison Chat</CardTitle>
        <CardDescription>Ask questions about how your investment compares to other assets</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar>
                  {message.role === "assistant" ? (
                    <>
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                      <AvatarImage src="/bot-avatar.png" />
                    </>
                  ) : (
                    <>
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                      <AvatarImage src="/user-avatar.png" />
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <Avatar>
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted text-foreground">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <Input
            placeholder="Compare my investment with..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
