import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Simple Error-Free Chatbot</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Simple Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 border rounded-md">
            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
