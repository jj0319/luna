import { StatusDashboard } from "@/components/status-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Search, MessageSquare, Settings } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">System Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/model-download">
                <Button className="w-full flex items-center justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Models
                </Button>
              </Link>
              <Link href="/search">
                <Button className="w-full flex items-center justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Configure Search
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="w-full flex items-center justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of system components</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDashboard />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to set up the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-4">
              <li className="p-2 border rounded">
                <strong>Download AI Models</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Visit the Model Download page to download the GPT-2 models locally.
                </p>
                <Link href="/model-download">
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Go to Model Download
                  </Button>
                </Link>
              </li>
              <li className="p-2 border rounded">
                <strong>Configure Google Search (Optional)</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Set up Google Custom Search API for enhanced AI responses.
                </p>
                <Link href="/search">
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Configure Search
                  </Button>
                </Link>
              </li>
              <li className="p-2 border rounded">
                <strong>Start Using the Platform</strong>
                <p className="text-sm text-muted-foreground mt-1">Begin chatting with AI or explore other features.</p>
                <Link href="/chat">
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Go to Chat
                  </Button>
                </Link>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>Explore the platform's capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link href="/chat" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">AI Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with local AI models</p>
              </Link>
              <Link href="/search" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Web Search</h3>
                <p className="text-sm text-muted-foreground">Google Custom Search integration</p>
              </Link>
              <Link href="/neural-network" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Neural Networks</h3>
                <p className="text-sm text-muted-foreground">Visualize neural networks</p>
              </Link>
              <Link href="/self-learning" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Self Learning</h3>
                <p className="text-sm text-muted-foreground">AI that learns from interactions</p>
              </Link>
              <Link href="/neural-learning" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Neural Learning</h3>
                <p className="text-sm text-muted-foreground">Neural network learning</p>
              </Link>
              <Link href="/thought-processor" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Thought Processor</h3>
                <p className="text-sm text-muted-foreground">Visualize AI thought processes</p>
              </Link>
              <Link href="/advanced-ai" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Advanced AI</h3>
                <p className="text-sm text-muted-foreground">Advanced AI capabilities</p>
              </Link>
              <Link href="/model-download" className="block p-3 border rounded hover:bg-muted/50 transition-colors">
                <h3 className="font-medium">Model Management</h3>
                <p className="text-sm text-muted-foreground">Download and manage models</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
