"use client"

import { useState } from "react"
import SearchIntegration from "@/components/search-integration"
import SearchDiagnostics from "@/components/search-diagnostics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function SearchPage() {
  const { toast } = useToast()
  const [selectedContent, setSelectedContent] = useState("")

  const handleResultSelect = (result: any) => {
    setSelectedContent(`Title: ${result.title}\nURL: ${result.link}\nSummary: ${result.snippet}`)

    toast({
      title: "Search Result Selected",
      description: "The search result has been added to your content.",
    })
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search Integration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SearchIntegration onResultSelect={handleResultSelect} />
        </div>

        <div>
          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Content</CardTitle>
                  <CardDescription>Content from search results that can be used in your AI system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedContent}
                    onChange={(e) => setSelectedContent(e.target.value)}
                    className="min-h-[200px]"
                    placeholder="Select a search result to see content here..."
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => {
                        // Here you would integrate with your AI system
                        toast({
                          title: "Content Saved",
                          description: "The content has been saved to your AI system.",
                        })
                      }}
                      disabled={!selectedContent}
                    >
                      Save to AI System
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>Configure your Google Custom Search API</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    To use this feature, you need to set up the following environment variables:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <code>GOOGLE_API_KEY</code> - Your Google API Key
                    </li>
                    <li>
                      <code>GOOGLE_CX</code> - Your Custom Search Engine ID
                    </li>
                  </ul>
                  <p className="text-sm mt-4">
                    You can set these in your .env.local file or in your Vercel project settings.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagnostics">
              <SearchDiagnostics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
