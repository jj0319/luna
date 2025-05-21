import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col items-start gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="w-full space-y-4">
          <div className="flex space-x-2 mb-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-1/4" />
          </div>

          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
