"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

type ModelInfo = {
  name: string
  displayName: string
  size: string
}

const MODELS: ModelInfo[] = [
  { name: "gpt2", displayName: "GPT-2 (Small)", size: "548 MB" },
  { name: "gpt2-medium", displayName: "GPT-2 Medium", size: "1.52 GB" },
  { name: "gpt2-large", displayName: "GPT-2 Large", size: "3.1 GB" },
  { name: "gpt2-xl", displayName: "GPT-2 XL", size: "6.4 GB" },
]

export default function ModelDownloadPage() {
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const startDownload = async () => {
    if (!selectedModel) return

    setDownloadStatus("downloading")
    setProgress(0)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/download-model?model=${selectedModel.name}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Download failed")
      }

      // This would be a server-sent events stream in a real implementation
      // Here we're just simulating progress
      const simulateProgress = () => {
        let currentProgress = 0
        const interval = setInterval(() => {
          currentProgress += Math.random() * 5
          if (currentProgress >= 100) {
            currentProgress = 100
            clearInterval(interval)
            setDownloadStatus("success")
          }
          setProgress(currentProgress)
        }, 500)
      }

      simulateProgress()
    } catch (error) {
      setDownloadStatus("error")
      setErrorMessage(error.message || "An error occurred during download")
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Download GPT-2 Models</h1>

      <Card>
        <CardHeader>
          <CardTitle>Local GPT-2 Models</CardTitle>
          <CardDescription>Download GPT-2 models to use them locally without needing an API key.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              Downloading models requires sufficient disk space and may take some time depending on your internet
              connection. Once downloaded, the models will be stored locally and can be used without an API key.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Available Models</h3>
            <div className="grid gap-2">
              {MODELS.map((model) => (
                <Button
                  key={model.name}
                  variant={selectedModel?.name === model.name ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="flex flex-col items-start">
                    <span>{model.displayName}</span>
                    <span className="text-xs text-muted-foreground">Size: {model.size}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {selectedModel && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Download {selectedModel.displayName}</h3>

              {downloadStatus === "downloading" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Downloading...</span>
                    <span className="text-sm">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {downloadStatus === "success" && (
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Download Complete</AlertTitle>
                  <AlertDescription>
                    {selectedModel.displayName} has been downloaded successfully and is ready to use.
                  </AlertDescription>
                </Alert>
              )}

              {downloadStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Download Failed</AlertTitle>
                  <AlertDescription>
                    {errorMessage || "An error occurred during download. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                {downloadStatus !== "downloading" && (
                  <Button onClick={startDownload} disabled={downloadStatus === "downloading"}>
                    {downloadStatus === "downloading" ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/chat">Return to Chat</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
