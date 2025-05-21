import { ErrorDisplay } from "@/components/errors/error-display"
import { LunaError } from "@/lib/errors/error-handler"

export default function NotFound() {
  const notFoundError = new LunaError("RESOURCE_NOT_FOUND", undefined, "요청한 페이지를 찾을 수 없습니다")

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorDisplay error={notFoundError} reset={() => (window.location.href = "/")} showDetails={true} />
      </div>
    </div>
  )
}
