"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function StatusDashboard() {
  const [status, setStatus] = useState({
    googleApi: "unknown",
    models: {
      gpt2: false,
      "gpt2-medium": false,
      "gpt2-large": false,
      "gpt2-xl": false,
    },
    database: "unknown",
  })

  useEffect(() => {
    // Check Google API status
    const checkGoogleApi = async () => {
      try {
        // In browser preview, we'll just simulate the API check
        // In a real environment, you would make an actual API call
        const hasGoogleApiKey = process.env.GOOGLE_API_KEY && process.env.GOOGLE_ID
        setStatus((prev) => ({
          ...prev,
          googleApi: hasGoogleApiKey ? "available" : "unavailable",
        }))
      } catch (error) {
        console.error("Error checking Google API:", error)
        setStatus((prev) => ({ ...prev, googleApi: "error" }))
      }
    }

    // Check model status
    const checkModels = async () => {
      try {
        // In browser preview, we'll just use mock data
        // In a real environment, you would fetch from the API
        setStatus((prev) => ({
          ...prev,
          models: {
            gpt2: false,
            "gpt2-medium": false,
            "gpt2-large": false,
            "gpt2-xl": false,
          },
        }))
      } catch (error) {
        console.error("Error checking models:", error)
      }
    }

    // Check database status
    const checkDatabase = async () => {
      try {
        // In browser preview, we'll just simulate the database check
        setStatus((prev) => ({ ...prev, database: "available" }))
      } catch (error) {
        console.error("Error checking database:", error)
        setStatus((prev) => ({ ...prev, database: "error" }))
      }
    }

    checkGoogleApi()
    checkModels()
    checkDatabase()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Google Search API</h3>
              <p className="text-sm text-muted-foreground">Custom Search Integration</p>
            </div>
            <StatusBadge status={status.googleApi} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Local Models</h3>
              <p className="text-sm text-muted-foreground">GPT-2 Model Availability</p>
            </div>
            <StatusBadge
              status={Object.values(status.models).some((available) => available) ? "available" : "unavailable"}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Database</h3>
              <p className="text-sm text-muted-foreground">In-memory Database Status</p>
            </div>
            <StatusBadge status={status.database} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "available":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available
        </Badge>
      )
    case "unavailable":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Not Configured
        </Badge>
      )
    case "error":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="animate-pulse">
          Checking...
        </Badge>
      )
  }
}
