import { NextResponse } from "next/server"
import { saveSetup, loadSetup } from "@/lib/simulation-service"

export async function POST(request: Request) {
  try {
    const setupParams = await request.json()

    const success = await saveSetup(setupParams)

    if (!success) {
      return NextResponse.json({ success: false, error: "Falha ao salvar configurações" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Configurações salvas com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar setup:", error)
    return NextResponse.json({ success: false, error: "Falha ao salvar configurações" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const setupParams = await loadSetup()

    if (!setupParams) {
      return NextResponse.json({ success: false, error: "Nenhuma configuração encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      setupParams,
    })
  } catch (error) {
    console.error("Erro ao carregar setup:", error)
    return NextResponse.json({ success: false, error: "Falha ao carregar configurações" }, { status: 500 })
  }
}
