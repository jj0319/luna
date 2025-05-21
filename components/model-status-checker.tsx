"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Download, RefreshCw } from "lucide-react"
import { LOCAL_MODELS } from "@/lib/local-ai"

export function ModelStatusChecker() {
  const [modelStatus, setModelStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkModels = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In browser environment, we'll use a mock implementation
      // that assumes models are not available locally
      const mockStatus: Record<string, boolean> = {}

      Object.values(LOCAL_MODELS).forEach((model) => {
        mockStatus[model] = false
      })

      setModelStatus(mockStatus)
    } catch (err) {
      console.error("Error checking models:", err)
      setError("Failed to check model status")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkModels()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Local AI Models</span>
          <Button variant="outline" size="sm" onClick={checkModels} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>Status of locally available AI models</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(LOCAL_MODELS).map(([key, model]) => (
              <div key={model} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{key.replace("GPT2_", "GPT-2 ")}</span>
                  <div className="text-sm text-muted-foreground">{model}</div>
                </div>
                <div className="flex items-center">
                  {isLoading ? (
                    <Badge variant="outline" className="animate-pulse">
                      Checking...
                    </Badge>
                  ) : modelStatus[model] ? (
                    <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Not Found
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Download className="h-3 w-3 mr-1" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Note: Local models are not supported in the browser environment. This is a preview mode only.</p>
        </div>
      </CardContent>
    </Card>
  )
}
