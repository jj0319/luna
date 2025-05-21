import { PersonaCreator } from "@/components/persona-creator"

export default function CreatePersonaPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create AI Persona</h1>
        <p className="text-muted-foreground">
          Design a custom AI personality with unique traits, emotions, and conversation styles
        </p>
      </div>

      <PersonaCreator />
    </div>
  )
}
