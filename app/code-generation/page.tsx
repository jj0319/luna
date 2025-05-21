import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Code, FileCode, Terminal, Braces } from "lucide-react"

export const metadata: Metadata = {
  title: "Code Generation - Luna",
  description: "Generate code from natural language descriptions",
}

export default function CodeGenerationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Code Generation</h1>
      <p className="text-lg mb-8">Generate code from natural language descriptions using advanced AI models.</p>

      <Tabs defaultValue="web" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="web" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Web Development</span>
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span>Backend</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Braces className="h-4 w-4" />
            <span>Data Science</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span>Mobile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="web" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Web Development Code Generator</CardTitle>
              <CardDescription>Generate HTML, CSS, JavaScript, React, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                    Describe what you want to create
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., Create a responsive navigation bar with a logo, links, and a dropdown menu"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Generate Code</Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Generated Code</label>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md min-h-[200px] font-mono text-sm">
                    {/* Generated code will appear here */}
                    <p className="text-slate-400">// Generated code will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backend Code Generator</CardTitle>
              <CardDescription>Generate Node.js, Python, Java, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt-backend" className="block text-sm font-medium mb-2">
                    Describe what you want to create
                  </label>
                  <Textarea
                    id="prompt-backend"
                    placeholder="E.g., Create a REST API endpoint that handles user authentication"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Generate Code</Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Generated Code</label>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md min-h-[200px] font-mono text-sm">
                    {/* Generated code will appear here */}
                    <p className="text-slate-400">// Generated code will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Science Code Generator</CardTitle>
              <CardDescription>Generate Python, R, and data analysis code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt-data" className="block text-sm font-medium mb-2">
                    Describe what you want to create
                  </label>
                  <Textarea
                    id="prompt-data"
                    placeholder="E.g., Create a script to analyze and visualize sales data from a CSV file"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Generate Code</Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Generated Code</label>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md min-h-[200px] font-mono text-sm">
                    {/* Generated code will appear here */}
                    <p className="text-slate-400"># Generated code will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Development Code Generator</CardTitle>
              <CardDescription>Generate React Native, Flutter, and mobile app code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt-mobile" className="block text-sm font-medium mb-2">
                    Describe what you want to create
                  </label>
                  <Textarea
                    id="prompt-mobile"
                    placeholder="E.g., Create a mobile app screen with a list of items and a search bar"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Generate Code</Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Generated Code</label>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md min-h-[200px] font-mono text-sm">
                    {/* Generated code will appear here */}
                    <p className="text-slate-400">// Generated code will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
