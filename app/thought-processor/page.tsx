import ThoughtProcessor from "@/components/thought-processor"

export const metadata = {
  title: "Thought Processor - Natural Language to Machine Format",
  description: "Process natural language thoughts into machine-readable formats",
}

export default function ThoughtProcessorPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Natural Language to Machine Format Processor</h1>
      <ThoughtProcessor />
    </div>
  )
}
