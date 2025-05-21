import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VoiceInput from "@/components/voice-input"
import TextToSpeechPlayer from "@/components/text-to-speech-player"
import ImageGeneratorUI from "@/components/image-generator-ui"
import TranslatorUI from "@/components/translator-ui"
import TextSummarizerUI from "@/components/text-summarizer-ui"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, ImageIcon, Languages, Mic, FileText, Search, Database, Network } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Hub - Luna",
  description: "Access all AI capabilities in one place",
}

export default function AIHubPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Luna AI Hub</h1>
      <p className="text-lg mb-8">Access all of Luna's advanced AI capabilities in one central location.</p>

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span>Voice</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Image</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span>Language</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Speech Recognition</CardTitle>
                <CardDescription>Convert spoken language into written text</CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceInput />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Text to Speech</CardTitle>
                <CardDescription>Convert written text into natural-sounding speech</CardDescription>
              </CardHeader>
              <CardContent>
                <TextToSpeechPlayer />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Generation</CardTitle>
              <CardDescription>Generate images from text descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGeneratorUI />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Translation</CardTitle>
              <CardDescription>Translate text between multiple languages</CardDescription>
            </CardHeader>
            <CardContent>
              <TranslatorUI />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Summarization</CardTitle>
              <CardDescription>Generate concise summaries of longer texts</CardDescription>
            </CardHeader>
            <CardContent>
              <TextSummarizerUI />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Neural Networks</CardTitle>
                <CardDescription>Train and use neural networks</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/neural-network">
                  <Button className="w-full">
                    Open Neural Network
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Code Generation</CardTitle>
                <CardDescription>Generate code from natural language</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/code-generation">
                  <Button className="w-full">
                    Open Code Generator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Graph</CardTitle>
                <CardDescription>Explore connected information</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/knowledge-graph">
                  <Button className="w-full">
                    Open Knowledge Graph
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Integrated AI Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                <span>AI Search</span>
              </CardTitle>
              <CardDescription>Enhanced search with AI capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/search">
                <Button className="w-full">
                  Open AI Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>AI Database</span>
              </CardTitle>
              <CardDescription>Intelligent database interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/database">
                <Button className="w-full">
                  Open AI Database
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                <span>Unified AI</span>
              </CardTitle>
              <CardDescription>Combined AI systems working together</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/unified-ai">
                <Button className="w-full">
                  Open Unified AI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
