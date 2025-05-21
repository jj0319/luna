import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Sparkles, Bot, Lightbulb, Cpu, Network, Database } from "lucide-react"
import Link from "next/link"

export default function AIIntegrationHub() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">AI Integration Hub</h2>
      <p className="text-lg mb-8">Connect and manage all your AI capabilities from a central dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>Neural Networks</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>Train and deploy custom neural networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Models Trained:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Accuracy:</span>
                <span className="font-medium">92.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">2 days ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/neural-network" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Neural Networks
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Natural Language</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>Process and understand natural language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Supported Languages:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Understanding Rate:</span>
                <span className="font-medium">89.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">1 day ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/chat" className="w-full">
              <Button variant="outline" className="w-full">
                Manage NLU
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span>Image Generation</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>Generate images from text descriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Images Generated:</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quality Score:</span>
                <span className="font-medium">8.4/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Used:</span>
                <span className="font-medium">Today</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/ai-hub" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Image Generation
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-500" />
                <span>Conversational AI</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>Advanced chatbot and conversation systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversations:</span>
                <span className="font-medium">342</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Satisfaction Rate:</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">Today</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/chatbot" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Conversational AI
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span>Reinforcement Learning</span>
              </CardTitle>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                In Progress
              </Badge>
            </div>
            <CardDescription>Self-improving AI through reinforcement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Agents:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Learning Rate:</span>
                <span className="font-medium">76.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">3 days ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/self-learning" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Reinforcement Learning
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-red-500" />
                <span>Emotion Detection</span>
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Beta
              </Badge>
            </div>
            <CardDescription>Detect and analyze emotions in text and speech</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Emotions Detected:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Accuracy:</span>
                <span className="font-medium">81.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">5 days ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Emotion Detection
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-indigo-500" />
                <span>Knowledge Graph</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>Connected information and concept relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nodes:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Connections:</span>
                <span className="font-medium">5,892</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">Yesterday</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/knowledge-graph" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Knowledge Graph
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-teal-500" />
                <span>Memory System</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>Long-term memory and learning storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Size:</span>
                <span className="font-medium">2.3 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Recall Accuracy:</span>
                <span className="font-medium">96.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated:</span>
                <span className="font-medium">Today</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Memory System
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
