import { NextResponse } from "next/server"
import { resetPersonaSystemToLuna, getLunaPersona } from "@/lib/persona-system-reset"

export async function POST() {
  try {
    const success = await resetPersonaSystemToLuna()

    if (success) {
      const luna = getLunaPersona()

      return NextResponse.json({
        success: true,
        message: "Persona system reset to Luna only",
        luna,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reset persona system to Luna only",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in reset-personas API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error resetting persona system",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
