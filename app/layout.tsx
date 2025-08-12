import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Header from '@/components/Header'
import { SimulationProvider } from '@/contexts/SimulationContext'

export const metadata: Metadata = {
  title: 'SIMULLAKT - Simulação Financeira Avançada',
  description: 'Plataforma avançada de simulação financeira com análise de mercado e projeções de investimento',
  generator: 'SIMULLAKT v2.0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning={true} className={`${GeistSans.className} bg-white`}>
        <SimulationProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </SimulationProvider>
      </body>
    </html>
  )
}
