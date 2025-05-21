"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SearchResult = {
  title: string
  link: string
  snippet: string
  displayLink: string
}

export default function SearchIntegration({
  onResultSelect,
}: {
  onResultSelect?: (result: SearchResult) => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setErrorDetails(null)

    try {
      // Ensure the query is properly encoded in the URL
      const response = await fetch(`/api/search?query=${encodeURIComponent(query.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Search request failed")
      }

      if (data.items && Array.isArray(data.items)) {
        const formattedResults = data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink,
        }))

        setResults(formattedResults)
      } else {
        // Handle case where no results are found
        console.log("No search results found:", data)
        setResults([])
      }
    } catch (err) {
      console.error("Search error:", err)
      setError(err.message || "Failed to perform search. Please try again.")

      // If we have detailed error information, show it
      if (err.details) {
        setErrorDetails(err.details)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Search Integration</CardTitle>
        <CardDescription>Search the web for information to enhance AI responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2 mb-4">
          <Input
            placeholder="Enter search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {errorDetails && (
                <details className="mt-2 text-xs">
                  <summary>Technical details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{errorDetails}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[300px] w-full rounded-md border">
          {results.length > 0 ? (
            <div className="p-4 space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {result.title}
                      <ExternalLink className="inline-block ml-1 h-3 w-3" />
                    </a>
                    {onResultSelect && (
                      <Button variant="ghost" size="sm" onClick={() => onResultSelect(result)}>
                        Use
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <Badge variant="outline" className="mr-2">
                      {result.displayLink}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{result.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {isLoading ? "Searching..." : "No results to display"}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex justify-between w-full">
          <span>Results powered by Google Custom Search API</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => {
              // Test the API configuration
              fetch("/api/search?query=test")
                .then((res) => res.json())
                .then((data) => {
                  if (data.error) {
                    setError(`API Configuration Test: ${data.error}`)
                    setErrorDetails(data.details || null)
                  } else {
                    setError("API Configuration Test: Success")
                    setErrorDetails(null)
                  }
                })
                .catch((err) => {
                  setError("API Configuration Test: Failed")
                  setErrorDetails(err.message)
                })
            }}
          >
            Test API Config
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
