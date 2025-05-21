"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import type { SearchResult } from "@/lib/oracle-search"

interface SearchResultsDisplayProps {
  results: SearchResult[]
  query: string
  onClose?: () => void
}

export function SearchResultsDisplay({ results, query, onClose }: SearchResultsDisplayProps) {
  const [expanded, setExpanded] = useState(false)

  if (!results || results.length === 0) {
    return null
  }

  return (
    <Card className="mt-4 border border-blue-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-500" />
            <span>검색 결과: {query}</span>
            <Badge variant="outline" className="ml-2">
              {results.length}개
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="p-4 pt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <h3 className="font-medium text-sm">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {result.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{result.snippet}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">{new URL(result.link).hostname}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  )
}
