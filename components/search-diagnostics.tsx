"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function SearchDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check API configuration
      const configResponse = await fetch("/api/search/debug")
      const configData = await configResponse.json()

      // Test a simple search
      const testResponse = await fetch("/api/search?query=test")
      const testData = await testResponse.json()

      setDiagnostics({
        config: configData,
        test: {
          status: testResponse.status,
          ok: testResponse.ok,
          data: testData,
        },
      })
    } catch (err) {
      setError(err.message || "Failed to run diagnostics")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search API Diagnostics</CardTitle>
        <CardDescription>Check your Google Custom Search API configuration</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diagnostics && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">API Configuration</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  {diagnostics.config.diagnostics.apiKeySet ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>Google API Key: {diagnostics.config.diagnostics.apiKeySet ? "Set" : "Not Set"}</span>
                </li>
                <li className="flex items-center">
                  {diagnostics.config.diagnostics.idSet ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>Google ID: {diagnostics.config.diagnostics.idSet ? "Set" : "Not Set"}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Test Search</h3>
              {diagnostics.test.ok ? (
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <AlertDescription>Search API is working correctly!</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Search API returned an error (Status: {diagnostics.test.status})
                    <pre className="mt-2 text-xs whitespace-pre-wrap">
                      {JSON.stringify(diagnostics.test.data, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runDiagnostics} disabled={isLoading}>
          {isLoading ? "Running..." : "Run Diagnostics"}
        </Button>
      </CardFooter>
    </Card>
  )
}
