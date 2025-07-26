import { NextResponse } from "next/server"
import { calculateFullProjection } from "@/lib/calculation"
import { getHistoricalRates } from "@/lib/currency-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      initialInvestment,
      currency,
      entryFee,
      exitFee,
      profitRate,
      dailyFee,
      operationsPerDay,
      projectionMonths,
      includeWeekends,
      startDate,
    } = body

    // Validate input
    if (!initialInvestment || initialInvestment <= 0) {
      return NextResponse.json({ success: false, error: "Invalid initial investment" }, { status: 400 })
    }

    // Get historical exchange rate if startDate is provided
    let exchangeRate = 1
    if (startDate && currency !== "USD") {
      try {
        const rates = await getHistoricalRates(startDate, "USD")
        exchangeRate = rates[currency] || 1
      } catch (error) {
        console.error("Failed to fetch historical rates:", error)
        // Continue with default exchange rate
      }
    }

    // Convert initial investment to USD
    const initialInvestmentUSD = currency === "USD" ? initialInvestment : initialInvestment / exchangeRate

    // Calculate projection
    const projection = calculateFullProjection(
      initialInvestmentUSD,
      entryFee,
      profitRate,
      exitFee,
      dailyFee,
      operationsPerDay,
      projectionMonths,
      includeWeekends,
    )

    // Generate a unique ID for this simulation
    const simulationId = `sim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // In a real app, you would store this simulation in a database

    return NextResponse.json({
      success: true,
      simulationId,
      startDate,
      currency,
      exchangeRate,
      projection,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Simulation calculation failed" }, { status: 500 })
  }
}
