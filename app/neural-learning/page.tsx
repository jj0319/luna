import NeuralSelfLearningChat from "@/components/neural-self-learning-chat"

export default function NeuralLearningPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h1 className="text-2xl font-medium mb-6 text-center text-gray-800">자가 학습 AI 시스템</h1>
      <NeuralSelfLearningChat />
    </div>
  )
}
