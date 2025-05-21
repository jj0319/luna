import type { Metadata } from "next"
import AIStatusDashboard from "@/components/ai-status-dashboard"

export const metadata: Metadata = {
  title: "AI Status - Luna",
  description: "Monitor the operational status of all AI systems",
}

export default function AIStatusPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Systems Status</h1>
      <p className="text-lg mb-8">
        Monitor the operational status and performance of all AI systems in the Luna platform.
      </p>

      <AIStatusDashboard />
    </div>
  )
}
