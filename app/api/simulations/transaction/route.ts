import { NextResponse } from "next/server"
import { addTransaction, getSimulationById } from "@/lib/simulation-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { simulationId, type, amount, operationId } = body

    // Validar entrada
    if (!simulationId) {
      return NextResponse.json({ success: false, error: "ID da simulação é obrigatório" }, { status: 400 })
    }

    if (!type || (type !== "deposit" && type !== "withdrawal")) {
      return NextResponse.json({ success: false, error: "Tipo de transação inválido" }, { status: 400 })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Valor inválido" }, { status: 400 })
    }

    // Verificar se a simulação existe
    const simulation = await getSimulationById(simulationId)
    if (!simulation) {
      return NextResponse.json({ success: false, error: "Simulação não encontrada" }, { status: 404 })
    }

    // Adicionar a transação
    const updatedSimulation = await addTransaction(simulationId, type, amount, operationId)

    if (!updatedSimulation) {
      return NextResponse.json({ success: false, error: "Falha ao processar a transação" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      simulation: updatedSimulation,
    })
  } catch (error) {
    console.error("Erro ao processar transação:", error)
    return NextResponse.json({ success: false, error: "Falha ao processar a transação" }, { status: 500 })
  }
}
