import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PreloadLinks from "@/components/PreloadLinks"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIMULAK - Simulação Financeira Avançada",
  description: "Plataforma avançada de simulação financeira com análise de mercado e projeções de investimento",
  generator: "SIMULAK v2.0",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <PreloadLinks />
        {children}
      </body>
    </html>
  )
}
