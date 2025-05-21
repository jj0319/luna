import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-1/3 mb-6" />
      <Skeleton className="h-6 w-2/3 mb-8" />

      <Skeleton className="h-12 w-full mb-8" />

      <div className="space-y-6">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  )
}
