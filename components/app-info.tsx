import { ENV } from "../config/env"

export default function AppInfo() {
  return (
    <div>
      <h1>{ENV.APP_NAME}</h1>
      <p>버전: {ENV.APP_VERSION}</p>
      {/* 나머지 앱 정보 */}
    </div>
  )
}
