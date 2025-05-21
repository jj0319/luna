import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function CreatePersonaLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />

              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-20 w-full" />

              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  )
}
