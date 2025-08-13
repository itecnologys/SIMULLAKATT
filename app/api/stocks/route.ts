import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "Symbols parameter is required" }, { status: 400 });
  }

  const symbolArray = symbols.split(",");

  try {
    // Dados mockados para demonstração (quando Yahoo Finance falha)
    const mockData: { [key: string]: { price: number; change: number } } = {
      // Ações principais
      AAPL: { price: 175.43, change: 1.25 },
      TSLA: { price: 242.54, change: -0.87 },
      MSFT: { price: 378.85, change: 0.92 },
      GOOGL: { price: 142.56, change: 0.45 },
      AMZN: { price: 145.24, change: -0.32 },
      NVDA: { price: 485.09, change: 2.15 },
      META: { price: 334.69, change: 1.08 },
      NFLX: { price: 485.09, change: -0.75 },
      // Índices globais
      "^GSPC": { price: 4523.45, change: 0.68 }, // S&P 500
      "^IXIC": { price: 14234.67, change: 1.12 }, // NASDAQ
      "^DJI": { price: 35234.89, change: -0.23 }, // Dow Jones
      "^FTSE": { price: 7542.12, change: 0.45 }, // FTSE 100
      "^N225": { price: 32456.78, change: -0.12 }, // Nikkei 225
      "^GDAXI": { price: 15678.90, change: 0.78 }, // DAX
      "^FCHI": { price: 7234.56, change: 0.34 }, // CAC 40
      "^BSESN": { price: 65432.10, change: 1.23 }, // BSE SENSEX
      "^HSI": { price: 18765.43, change: -0.56 }, // Hang Seng
      "^SSEC": { price: 3123.45, change: 0.89 }, // Shanghai Composite
      "^BVSP": { price: 123456.78, change: 0.67 }, // Bovespa
      "^MXX": { price: 54321.09, change: -0.23 }, // IPC Mexico
      "^AXJO": { price: 7123.45, change: 0.45 } // ASX 200
    };

    const results = await Promise.all(
      symbolArray.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
          );
          const json = await response.json();
          
          if (!json.quoteResponse || !json.quoteResponse.result || json.quoteResponse.result.length === 0) {
            console.warn(`Dados não encontrados para ${symbol}, usando mock`);
            const mockValue = mockData[symbol] || { price: 0, change: 0 };
            return {
              symbol: symbol,
              price: mockValue.price,
              change: mockValue.change,
            };
          }
          
          const quote = json.quoteResponse.result[0];
          const realPrice = quote.regularMarketPrice;
          const realChange = quote.regularMarketChangePercent;
          
          // Se dados reais estão disponíveis, use-os; senão, use mock
          if (realPrice && realPrice > 0) {
            return {
              symbol: symbol,
              price: realPrice,
              change: realChange || 0,
            };
          } else {
            console.warn(`Dados inválidos para ${symbol}, usando mock`);
            const mockValue = mockData[symbol] || { price: 0, change: 0 };
            return {
              symbol: symbol,
              price: mockValue.price,
              change: mockValue.change,
            };
          }
        } catch (symbolError) {
          console.error(`Erro ao buscar ${symbol}, usando mock:`, symbolError);
          const mockValue = mockData[symbol] || { price: 0, change: 0 };
          return {
            symbol: symbol,
            price: mockValue.price,
            change: mockValue.change,
          };
        }
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro geral na API de ações:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
} 