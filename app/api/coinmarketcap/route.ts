import { NextResponse } from "next/server";

const mockCryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 45000.00, change24h: 1250.50, changePercent24h: 2.85, volume24h: 25000000000, marketCap: 850000000000, lastUpdate: new Date().toISOString() },
  { symbol: "ETH", name: "Ethereum", price: 3200.00, change24h: -45.20, changePercent24h: -1.39, volume24h: 15000000000, marketCap: 380000000000, lastUpdate: new Date().toISOString() },
  { symbol: "BNB", name: "Binance Coin", price: 380.50, change24h: 12.30, changePercent24h: 3.34, volume24h: 8000000000, marketCap: 65000000000, lastUpdate: new Date().toISOString() },
  { symbol: "ADA", name: "Cardano", price: 1.25, change24h: 0.05, changePercent24h: 4.17, volume24h: 3000000000, marketCap: 40000000000, lastUpdate: new Date().toISOString() },
  { symbol: "SOL", name: "Solana", price: 95.75, change24h: -2.15, changePercent24h: -2.20, volume24h: 5000000000, marketCap: 35000000000, lastUpdate: new Date().toISOString() }
];

export async function GET() {
  try {
    // Resposta instantânea sem delay
    return NextResponse.json({
      success: true,
      data: mockCryptoData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch crypto data",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
