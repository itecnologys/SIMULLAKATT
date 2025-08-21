import { NextResponse } from 'next/server';

// Dados mock para resolver o problema de timeout
const mockMarketData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    change: 2.15,
    changePercent: 1.45,
    volume: 45000000,
    category: "Technology",
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 2750.80,
    change: -15.20,
    changePercent: -0.55,
    volume: 25000000,
    category: "Technology",
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 320.45,
    change: 5.30,
    changePercent: 1.68,
    volume: 35000000,
    category: "Technology",
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 850.75,
    change: 25.50,
    changePercent: 3.09,
    volume: 55000000,
    category: "Automotive",
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 3200.00,
    change: -45.80,
    changePercent: -1.41,
    volume: 30000000,
    category: "E-commerce",
    lastUpdate: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Simular um pequeno delay para parecer real
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: mockMarketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch market data",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
