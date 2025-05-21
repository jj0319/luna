import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Minus, Network, Database, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Knowledge Graph - Luna",
  description: "Explore connected information in a knowledge graph",
}

export default function KnowledgeGraphPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Knowledge Graph</h1>
      <p className="text-lg mb-8">Explore connected information and discover relationships between concepts.</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>Find concepts in the knowledge graph</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search concepts..." />
                  <Button size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Searches</h3>
                  <ul className="space-y-1">
                    <li className="text-sm px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                      Artificial Intelligence
                    </li>
                    <li className="text-sm px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                      Machine Learning
                    </li>
                    <li className="text-sm px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                      Neural Networks
                    </li>
                    <li className="text-sm px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                      Natural Language Processing
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Adjust graph visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Zoom</label>
                  <div className="flex items-center mt-1">
                    <Button size="icon" variant="outline">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 mx-2 rounded-full">
                      <div className="bg-slate-900 dark:bg-slate-400 h-2 w-1/2 rounded-full"></div>
                    </div>
                    <Button size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Depth</label>
                  <div className="flex items-center mt-1">
                    <Button size="icon" variant="outline">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 mx-2 rounded-full">
                      <div className="bg-slate-900 dark:bg-slate-400 h-2 w-1/3 rounded-full"></div>
                    </div>
                    <Button size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button className="w-full">Reset View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Knowledge Graph Visualization</CardTitle>
              <CardDescription>Interactive visualization of connected concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 border rounded-md h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Search for a concept to visualize the knowledge graph
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <span>Data Sources</span>
            </CardTitle>
            <CardDescription>Connected knowledge sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-sm">Internal Knowledge Base</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm">Wikipedia API</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm">Research Papers Database</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Partial</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm">Custom Data Source</span>
                <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-full">Not Connected</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Concept Details</span>
            </CardTitle>
            <CardDescription>Information about selected concept</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p>Select a node in the graph to view details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
