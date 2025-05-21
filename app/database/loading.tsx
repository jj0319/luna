import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-10 w-[300px] mb-6" />

      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="responses">응답 데이터</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[350px] mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
                <div className="border rounded-md">
                  <div className="h-10 border-b px-4 flex items-center">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-[100px] mx-2" />
                    ))}
                  </div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 border-b px-4 flex items-center">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-[100px] mx-2" />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-10 w-[80px]" />
                  <Skeleton className="h-10 w-[80px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
