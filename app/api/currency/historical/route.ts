import { NextResponse } from "next/server"

// In a real app, this would fetch from an external API like Alpha Vantage or similar
// For demo purposes, we'll use sample data

interface HistoricalRate {
  date: string
  rate: number
}

// Sample historical data for major currencies against USD
const historicalData = {
  EUR: [
    { date: "2023-01-01", rate: 0.92 },
    { date: "2023-02-01", rate: 0.93 },
    { date: "2023-03-01", rate: 0.94 },
    { date: "2023-04-01", rate: 0.91 },
    { date: "2023-05-01", rate: 0.92 },
    { date: "2023-06-01", rate: 0.93 },
    { date: "2023-07-01", rate: 0.91 },
    { date: "2023-08-01", rate: 0.92 },
    { date: "2023-09-01", rate: 0.93 },
    { date: "2023-10-01", rate: 0.94 },
    { date: "2023-11-01", rate: 0.92 },
    { date: "2023-12-01", rate: 0.91 },
  ],
  GBP: [
    { date: "2023-01-01", rate: 0.79 },
    { date: "2023-02-01", rate: 0.8 },
    { date: "2023-03-01", rate: 0.81 },
    { date: "2023-04-01", rate: 0.8 },
    { date: "2023-05-01", rate: 0.79 },
    { date: "2023-06-01", rate: 0.78 },
    { date: "2023-07-01", rate: 0.77 },
    { date: "2023-08-01", rate: 0.78 },
    { date: "2023-09-01", rate: 0.79 },
    { date: "2023-10-01", rate: 0.8 },
    { date: "2023-11-01", rate: 0.79 },
    { date: "2023-12-01", rate: 0.78 },
  ],
  // Add more currencies as needed
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get("currency") || "EUR"
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  try {
    // In a real app, you would fetch from an external API here
    // For demo purposes, we'll use our sample data

    // Filter by date range if provided
    let data = historicalData[currency] || []

    if (startDate) {
      data = data.filter((item) => item.date >= startDate)
    }

    if (endDate) {
      data = data.filter((item) => item.date <= endDate)
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      currency,
      data,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch historical rates" }, { status: 500 })
  }
}
