import { NextResponse } from 'next/server';

// Dados mock para criptomoedas
const mockCryptoData = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 45000.00,
    change_24h: 2.5,
    volume_24h: 25000000000,
    market_cap: 850000000000,
    last_updated: new Date().toISOString()
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 3200.00,
    change_24h: -1.2,
    volume_24h: 15000000000,
    market_cap: 380000000000,
    last_updated: new Date().toISOString()
  },
  {
    id: 3,
    name: "Binance Coin",
    symbol: "BNB",
    price: 380.00,
    change_24h: 0.8,
    volume_24h: 2000000000,
    market_cap: 58000000000,
    last_updated: new Date().toISOString()
  },
  {
    id: 4,
    name: "Cardano",
    symbol: "ADA",
    price: 1.20,
    change_24h: 3.1,
    volume_24h: 800000000,
    market_cap: 38000000000,
    last_updated: new Date().toISOString()
  },
  {
    id: 5,
    name: "Solana",
    symbol: "SOL",
    price: 95.00,
    change_24h: -0.5,
    volume_24h: 1200000000,
    market_cap: 42000000000,
    last_updated: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '15');

    // Simular um pequeno delay para parecer real
    await new Promise(resolve => setTimeout(resolve, 100));

    if (action === 'latest') {
      const limitedData = mockCryptoData.slice(0, Math.min(limit, mockCryptoData.length));
      
      return NextResponse.json({
        success: true,
        data: limitedData,
        timestamp: new Date().toISOString()
      });
    }

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
