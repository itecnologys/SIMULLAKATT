"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, TrendingUp, Shield, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section Otimizada */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isLoaded ? "animate-in slide-in-from-left duration-700" : "opacity-0"}`}>
              <div className="space-y-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Simulação Avançada
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  <span className="text-primary">SIMULLAKT</span>
                  <br />
                  <span className="text-slate-700">Investimentos</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Simule estratégias de investimento com dados reais de mercado. Teste diferentes cenários antes de
                  investir seu dinheiro real.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link href="/dashboard">
                    Começar Simulação
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
                  <Link href="/market-analysis">Ver Análises</Link>
                </Button>
              </div>
            </div>

            {/* Área de Simulação Visual Simplificada */}
            <div className={`relative ${isLoaded ? "animate-in slide-in-from-right duration-700" : "opacity-0"}`}>
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Simulação em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Indicadores Simplificados */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Portfolio Value</span>
                    <span className="font-bold text-green-600">€15,247.89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Daily P&L</span>
                    <span className="font-bold text-green-600">+€247.32 (+1.65%)</span>
                  </div>

                  {/* Gráfico Simplificado */}
                  <div className="space-y-2 mt-6">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-3/4 animate-pulse"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-2/3 animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 w-4/5 animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Otimizada */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Como Funciona</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Três passos simples para começar a simular seus investimentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "1. Configure",
                description: "Defina seus parâmetros de investimento, taxa de lucro e período de simulação",
              },
              {
                icon: TrendingUp,
                title: "2. Simule",
                description: "Execute simulações com dados reais de mercado e veja os resultados em tempo real",
              },
              {
                icon: Shield,
                title: "3. Analise",
                description: "Analise os resultados e otimize sua estratégia antes de investir dinheiro real",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Comece a simular suas estratégias de investimento hoje mesmo. É gratuito e não requer cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/dashboard">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
              <Link href="/market-analysis">Ver Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
