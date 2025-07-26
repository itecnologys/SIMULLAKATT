import { NextResponse } from "next/server"

// Sample exchange rates data
// In a real app, you would fetch this from an external API
const exchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.82,
  CHF: 0.89,
  AUD: 1.52,
  CAD: 1.36,
  CNY: 7.21,
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      base: "USD",
      rates: exchangeRates,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch exchange rates" }, { status: 500 })
  }
}
