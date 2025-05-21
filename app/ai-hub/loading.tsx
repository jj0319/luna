import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-1/3 mb-6" />
      <Skeleton className="h-6 w-2/3 mb-8" />

      <Skeleton className="h-12 w-full mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-8 w-1/4 mb-6 mt-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    </div>
  )
}
