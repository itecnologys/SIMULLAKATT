import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarketTickerBloomberg from '@/components/MarketTickerBloomberg';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Market Ticker */}
      <MarketTickerBloomberg />
      
      {/* Hero Section */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Versão 2.004 - Agora Disponível
            </Badge>
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-8">
              SIMULAK
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Plataforma avançada para simulação e análise de operações financeiras
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/simulate">
                  <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10">
                    Iniciar Simulação
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Recursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simulação financeira inteligente
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Análise em Tempo Real',
                  description: 'Acompanhe e analise dados do mercado em tempo real para tomar decisões informadas.'
                },
                {
                  title: 'Simulações Avançadas',
                  description: 'Crie e teste diferentes cenários de investimento com nossa engine de simulação.'
                },
                {
                  title: 'Gestão de Risco',
                  description: 'Ferramentas completas para análise e gestão de risco em suas operações.'
                },
                {
                  title: 'Relatórios Detalhados',
                  description: 'Gere relatórios completos com métricas e indicadores importantes.'
                }
              ].map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="relative">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Comece agora mesmo a simular suas operações financeiras.
          </p>
          <Link href="/simulate">
            <Button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
              Começar Gratuitamente
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-gray-400 hover:text-gray-500">
              Sobre
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-500">
              Contato
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacidade
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 SIMULAK. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 