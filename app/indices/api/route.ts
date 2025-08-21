import { NextResponse } from "next/server";

// Dados mock baseados na imagem, organizados por mercados
const mockIndicesData = [
  // CRIPTOMOEDAS
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    price: 629499.00,
    change24h: 5320.50,
    changePercent: 0.85,
    volume24h: 15.13,
    volumeUnit: "BTC",
    category: "crypto",
    icon: "₿"
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    price: 23950.00,
    change24h: 1120.25,
    changePercent: 4.91,
    volume24h: 283.16,
    volumeUnit: "ETH",
    category: "crypto",
    icon: "Ξ"
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    price: 5.4962,
    change24h: -0.0182,
    changePercent: -0.33,
    volume24h: 2098696.22,
    volumeUnit: "USDT",
    category: "crypto",
    icon: "₮"
  },
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    price: 5.4933,
    change24h: -0.0193,
    changePercent: -0.35,
    volume24h: 40555.42,
    volumeUnit: "USDC",
    category: "crypto",
    icon: "💲"
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    price: 1030.00,
    change24h: 42.30,
    changePercent: 4.29,
    volume24h: 2051.68,
    volumeUnit: "SOL",
    category: "crypto",
    icon: "◎"
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "XRP",
    price: 16.322,
    change24h: 0.358,
    changePercent: 2.24,
    volume24h: 140678.47,
    volumeUnit: "XRP",
    category: "crypto",
    icon: "✖"
  },
  {
    id: "ada",
    symbol: "ADA",
    name: "Cardano",
    price: 4.872,
    change24h: 0.137,
    changePercent: 2.89,
    volume24h: 134045.57,
    volumeUnit: "ADA",
    category: "crypto",
    icon: "₳"
  },
  {
    id: "doge",
    symbol: "DOGE",
    name: "Dogecoin",
    price: 1.2234,
    change24h: 0.0494,
    changePercent: 4.21,
    volume24h: 243694.64,
    volumeUnit: "DOGE",
    category: "crypto",
    icon: "🐕"
  },
  {
    id: "dot",
    symbol: "DOT",
    name: "Polkadot",
    price: 21.374,
    change24h: 0.568,
    changePercent: 2.73,
    volume24h: 3689.14,
    volumeUnit: "DOT",
    category: "crypto",
    icon: "●"
  },
  {
    id: "avax",
    symbol: "AVAX",
    name: "Avalanche",
    price: 128.92,
    change24h: 4.10,
    changePercent: 3.28,
    volume24h: 363.36,
    volumeUnit: "AVAX",
    category: "crypto",
    icon: "❄"
  },
  {
    id: "shib",
    symbol: "SHIB",
    name: "Shiba Inu",
    price: 0.00006875,
    change24h: 0.00000164,
    changePercent: 2.44,
    volume24h: 228428400.54,
    volumeUnit: "SHIB",
    category: "crypto",
    icon: "🐕"
  },
  {
    id: "pol",
    symbol: "POL",
    name: "Polygon Ecosystem Token",
    price: 1.3490,
    change24h: 0.0461,
    changePercent: 3.54,
    volume24h: 170194.05,
    volumeUnit: "POL",
    category: "crypto",
    icon: "🔷"
  },
  {
    id: "ltc",
    symbol: "LTC",
    name: "Litecoin",
    price: 640.70,
    change24h: 12.05,
    changePercent: 1.91,
    volume24h: 529.14,
    volumeUnit: "LTC",
    category: "crypto",
    icon: "Ł"
  },
  {
    id: "link",
    symbol: "LINK",
    name: "Chainlink",
    price: 146.06,
    change24h: 14.27,
    changePercent: 10.83,
    volume24h: 16766.66,
    volumeUnit: "LINK",
    category: "crypto",
    icon: "🔗"
  },
  {
    id: "uni",
    symbol: "UNI",
    name: "Uniswap",
    price: 58.40,
    change24h: 2.56,
    changePercent: 4.58,
    volume24h: 1717.11,
    volumeUnit: "UNI",
    category: "crypto",
    icon: "🦄"
  },
  {
    id: "xlm",
    symbol: "XLM",
    name: "Stellar",
    price: 2.2281,
    change24h: 0.0432,
    changePercent: 1.98,
    volume24h: 33067.93,
    volumeUnit: "XLM",
    category: "crypto",
    icon: "⭐"
  },
  {
    id: "ape",
    symbol: "APE",
    name: "ApeCoin",
    price: 3.362,
    change24h: 0.077,
    changePercent: 2.34,
    volume24h: 125000.00,
    volumeUnit: "APE",
    category: "crypto",
    icon: "🦧"
  },
  {
    id: "mana",
    symbol: "MANA",
    name: "Decentraland",
    price: 1.5661,
    change24h: 0.0422,
    changePercent: 2.77,
    volume24h: 89000.00,
    volumeUnit: "MANA",
    category: "crypto",
    icon: "🏙️"
  },
  {
    id: "sand",
    symbol: "SAND",
    name: "The Sandbox",
    price: 1.5380,
    change24h: 0.0297,
    changePercent: 1.97,
    volume24h: 75000.00,
    volumeUnit: "SAND",
    category: "crypto",
    icon: "🏖️"
  },
  {
    id: "sonic",
    symbol: "SONIC",
    name: "Sonic",
    price: 1.756,
    change24h: 0.070,
    changePercent: 4.15,
    volume24h: 45000.00,
    volumeUnit: "SONIC",
    category: "crypto",
    icon: "⚡"
  },

  // AÇÕES (Exemplos)
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    change24h: 2.15,
    changePercent: 1.45,
    volume24h: 45000000,
    volumeUnit: "Ações",
    category: "stocks",
    icon: "��"
  },
  {
    id: "googl",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 2750.80,
    change24h: -15.20,
    changePercent: -0.55,
    volume24h: 25000000,
    volumeUnit: "Ações",
    category: "stocks",
    icon: "🔍"
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft",
    price: 320.45,
    change24h: 5.30,
    changePercent: 1.68,
    volume24h: 35000000,
    volumeUnit: "Ações",
    category: "stocks",
    icon: "🪟"
  },
  {
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 850.75,
    change24h: 25.50,
    changePercent: 3.09,
    volume24h: 55000000,
    volumeUnit: "Ações",
    category: "stocks",
    icon: "🚗"
  },

  // ÍNDICES
  {
    id: "ibov",
    symbol: "IBOV",
    name: "Ibovespa",
    price: 125000.50,
    change24h: 1250.75,
    changePercent: 1.01,
    volume24h: 8500000000,
    volumeUnit: "Pontos",
    category: "indices",
    icon: "📈"
  },
  {
    id: "spx",
    symbol: "SPX",
    name: "S&P 500",
    price: 4500.25,
    change24h: -25.50,
    changePercent: -0.56,
    volume24h: 25000000000,
    volumeUnit: "Pontos",
    category: "indices",
    icon: "��"
  },
  {
    id: "dji",
    symbol: "DJI",
    name: "Dow Jones",
    price: 35000.75,
    change24h: 150.25,
    changePercent: 0.43,
    volume24h: 18000000000,
    volumeUnit: "Pontos",
    category: "indices",
    icon: "📉"
  },

  // FOREX
  {
    id: "usdbrl",
    symbol: "USD/BRL",
    name: "Dólar/Real",
    price: 5.25,
    change24h: 0.05,
    changePercent: 0.96,
    volume24h: 1500000000,
    volumeUnit: "USD",
    category: "forex",
    icon: "💱"
  },
  {
    id: "eurusd",
    symbol: "EUR/USD",
    name: "Euro/Dólar",
    price: 1.0850,
    change24h: -0.0025,
    changePercent: -0.23,
    volume24h: 2000000000,
    volumeUnit: "EUR",
    category: "forex",
    icon: "💶"
  },

  // COMMODITIES
  {
    id: "gold",
    symbol: "GOLD",
    name: "Ouro",
    price: 1950.50,
    change24h: 15.75,
    changePercent: 0.81,
    volume24h: 85000,
    volumeUnit: "oz",
    category: "commodities",
    icon: "🥇"
  },
  {
    id: "silver",
    symbol: "SILVER",
    name: "Prata",
    price: 24.85,
    change24h: 0.35,
    changePercent: 1.43,
    volume24h: 125000,
    volumeUnit: "oz",
    category: "commodities",
    icon: "🥈"
  }
];

export async function GET() {
  try {
    // Simular delay para parecer real
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      success: true,
      data: mockIndicesData,
      timestamp: new Date().toISOString(),
      module: "indices"
    });
  } catch (error) {
    console.error("Erro na API de índices:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Falha ao buscar dados de índices",
        timestamp: new Date().toISOString(),
        module: "indices"
      },
      { status: 500 }
    );
  }
}
