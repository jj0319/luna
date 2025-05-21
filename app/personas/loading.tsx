import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function PersonasLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <div className="w-full max-w-md mx-auto">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <Skeleton className={`h-20 ${i % 2 === 0 ? "w-64" : "w-48"} rounded-lg`} />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
