import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-5 w-full max-w-2xl mb-8" />

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-4 w-64 mt-1" />

          <div className="mt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className={`w-4/5 ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                  <Skeleton className="h-20 w-full rounded-lg" />
                  {i % 2 !== 0 && (
                    <div className="flex mt-1 space-x-1">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
