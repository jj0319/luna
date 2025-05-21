"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface AISystem {
  id: string
  name: string
  status: "operational" | "degraded" | "outage"
  uptime: number
  lastUpdated: string
}

interface AIStatusResponse {
  systems: AISystem[]
  overallStatus: "operational" | "degraded" | "outage"
  lastChecked: string
}

export default function AIStatusDashboard() {
  const [statusData, setStatusData] = useState<AIStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/ai-status")
        const data = await response.json()
        setStatusData(data)
      } catch (error) {
        console.error("Failed to fetch AI status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // In a real app, you might want to poll this endpoint periodically
    const interval = setInterval(fetchStatus, 60000) // every minute

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-slate-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Degraded
          </Badge>
        )
      case "outage":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Outage
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Unknown
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Systems Status</CardTitle>
            <CardDescription>Loading status information...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!statusData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Systems Status</CardTitle>
            <CardDescription>Failed to load status information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-red-500">
              <XCircle className="h-8 w-8 mr-2" />
              <span>Error loading status data</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>AI Systems Status</CardTitle>
              <CardDescription>Current operational status of all AI systems</CardDescription>
            </div>
            <div className="flex items-center">
              {getStatusIcon(statusData.overallStatus)}
              <span className="ml-2 text-sm">Last updated: {formatDate(statusData.lastChecked)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusData.systems.map((system) => (
              <div key={system.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{system.name}</h3>
                  <p className="text-sm text-slate-500">Uptime: {system.uptime}%</p>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(system.status)}
                  <span className="text-xs text-slate-500 mt-1">{formatDate(system.lastUpdated)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
