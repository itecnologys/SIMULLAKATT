"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Calculator,
  PieChart,
  Target,
  Clock
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MarketTickerBloomberg from "@/components/MarketTickerBloomberg"

export default function InstitutionalPage() {
  const router = useRouter()

  const features = [
    {
      icon: Calculator,
      title: "Simulação Avançada",
      description: "Algoritmos precisos baseados em dados reais de mercado para projeções confiáveis."
    },
    {
      icon: BarChart3,
      title: "Análise Completa",
      description: "Gráficos interativos e relatórios detalhados para tomada de decisão estratégica."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Sistema robusto de autenticação e proteção de dados financeiros."
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Interface rápida e responsiva para análises em tempo real."
    },
    {
      icon: PieChart,
      title: "Multi-ativos",
      description: "Suporte a ações, crypto, forex, commodities e índices globais."
    },
    {
      icon: Target,
      title: "Estratégias",
      description: "Configuração flexível de parâmetros para diferentes perfis de investimento."
    }
  ]

  const benefits = [
    "Redução de riscos através de simulação prévia",
    "Otimização de estratégias de investimento",
    "Análise de cenários múltiplos",
    "Relatórios profissionais detalhados",
    "Interface intuitiva e moderna",
    "Suporte a múltiplas moedas"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Market Ticker Bloomberg */}
      <MarketTickerBloomberg />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              Versão 2.004 - Agora Disponível
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SIMULAK
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Plataforma Avançada de Simulação Financeira
            </h2>
            
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Transforme suas estratégias de investimento com simulações precisas, 
              análises avançadas e relatórios profissionais. A ferramenta definitiva 
              para otimizar seus resultados financeiros.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={() => router.push('/simulate')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                Começar Simulação
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
              >
                Ver Dashboard
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50k+</div>
                <div className="text-gray-600">Simulações Executadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-600">Precisão de Cálculos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Disponibilidade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos Avançados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra as ferramentas que tornam o SIMULAK a escolha ideal 
              para profissionais do mercado financeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Por que escolher o SIMULAK?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Nossa plataforma oferece uma experiência completa para análise 
                e simulação financeira, com tecnologia de ponta e interface intuitiva.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ROI Otimizado</h3>
                <p className="text-sm text-gray-600">Maximize seus retornos</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Multi-usuário</h3>
                <p className="text-sm text-gray-600">Colaboração em equipe</p>
              </Card>
              <Card className="p-6 text-center">
                <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Global</h3>
                <p className="text-sm text-gray-600">Mercados mundiais</p>
              </Card>
              <Card className="p-6 text-center">
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tempo Real</h3>
                <p className="text-sm text-gray-600">Dados atualizados</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para revolucionar suas estratégias?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se aos profissionais que já utilizam o SIMULAK para 
            otimizar seus investimentos e reduzir riscos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/simulate')}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Iniciar Simulação Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => router.push('/overview')}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">SIMULAK</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                A plataforma mais avançada para simulação financeira, 
                oferecendo precisão e confiabilidade para suas decisões de investimento.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  v2.003
                </Badge>
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  Next.js 15
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/simulate" className="hover:text-white">Simulação</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/card" className="hover:text-white">SMLKCARD</Link></li>
                <li><Link href="/reports" className="hover:text-white">Relatórios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/overview" className="hover:text-white">Minha Conta</Link></li>
                <li><a href="mailto:support@simulak.com" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SIMULAK. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 