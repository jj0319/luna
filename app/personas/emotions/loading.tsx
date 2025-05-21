import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PersonaEmotionsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>

                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>

                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}

                <div className="mt-8 relative h-64 w-full flex justify-center items-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
