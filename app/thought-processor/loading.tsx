import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-8 w-96 mx-auto mb-6" />
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-[100px] w-full" />
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}
