# 🚀 SIMULLAKT v2.0

**Sistema de Simulação Financeira Avançado**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

**SIMULLAKT** é uma plataforma avançada de simulação financeira que permite aos usuários configurar, executar e analisar estratégias de investimento com precisão matemática. O sistema oferece ferramentas completas para análise de mercado, projeções de longo prazo e relatórios detalhados.

### 🌟 Características Principais

- **Simulação Realista**: Algoritmos baseados em dados reais de mercado
- **Interface Intuitiva**: Design moderno e responsivo
- **Análise Avançada**: Gráficos interativos e relatórios detalhados
- **Configuração Flexível**: Parâmetros personalizáveis para diferentes estratégias
- **Segurança**: Sistema de autenticação e autorização robusto

## ✨ Funcionalidades

### 📊 Dashboard Principal
- Visão geral das simulações ativas
- Métricas de performance em tempo real
- Gráficos interativos de resultados
- Acesso rápido às funcionalidades principais

### ⚙️ Configuração de Parâmetros
- **Investimento Inicial**: Valor base para simulação
- **Operações por Dia**: Frequência de trades
- **Taxas de Entrada/Saída**: Custos operacionais
- **Taxa de Lucro**: Margem esperada por operação
- **Taxa Diária**: Crescimento esperado diário
- **Período de Projeção**: Horizonte temporal (até 60 meses)
- **Inclusão de Fins de Semana**: Opção para cálculos 24/7

### 📈 Relatórios e Análises
- **Relatório de Operações**: Detalhamento de cada trade
- **Análise de Performance**: Métricas de rentabilidade
- **Comparação de Estratégias**: Benchmark entre configurações
- **Projeções de Longo Prazo**: Simulações de 1-5 anos

### 🔍 Visão de Mercado
- Análise de tendências atuais
- Indicadores técnicos
- Comparação com benchmarks
- Insights de mercado

### 📋 Auditoria
- Histórico completo de operações
- Logs de alterações de configuração
- Rastreabilidade de decisões
- Compliance e transparência

## 🛠️ Tecnologias

### Frontend
- **Next.js 15.2.4** - Framework React com App Router
- **React 19** - Biblioteca de interface
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos interativos
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma 6.13.0** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Node.js 18.20.8** - Runtime JavaScript

### DevOps
- **PM2** - Process Manager para produção
- **Docker** - Containerização (opcional)
- **GitHub Actions** - CI/CD (opcional)

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### 1. Clone o Repositório
```bash
git clone https://github.com/itecnologys/SIMULLAKATT.git
cd SIMULLAKATT
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/simullakt"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Configurações da Aplicação
NODE_ENV="development"
```

### 4. Configure o Banco de Dados
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma migrate dev

# (Opcional) Popule com dados de exemplo
npx prisma db seed
```

### 5. Execute o Projeto
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## ⚙️ Configuração

### Configuração do Banco de Dados
O projeto usa Prisma como ORM. Configure o schema em `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Modelos do banco de dados...
```

### Configuração do Next.js
Ajuste as configurações em `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Outras configurações...
}

export default nextConfig
```

## 📖 Uso

### 1. Acesse a Aplicação
Abra `http://localhost:3000` no navegador

### 2. Configure uma Simulação
1. Vá para **Dashboard > Setup**
2. Preencha os parâmetros de investimento
3. Salve a configuração
4. Execute a simulação

### 3. Analise os Resultados
1. Visualize os gráficos no dashboard
2. Acesse os relatórios detalhados
3. Compare diferentes estratégias
4. Exporte os dados se necessário

### 4. Monitore o Desempenho
- Acompanhe métricas em tempo real
- Analise tendências históricas
- Ajuste parâmetros conforme necessário

## 🔌 API

### Endpoints Principais

#### Configurações
```http
GET    /api/setups          # Listar configurações
POST   /api/setups          # Criar configuração
GET    /api/setups/:id      # Obter configuração
PUT    /api/setups/:id      # Atualizar configuração
DELETE /api/setups/:id      # Deletar configuração
```

#### Simulações
```http
POST   /api/simulations     # Executar simulação
GET    /api/simulations/:id # Obter resultados
GET    /api/simulations     # Listar simulações
```

#### Relatórios
```http
GET    /api/reports/operations # Relatório de operações
GET    /api/reports/performance # Relatório de performance
GET    /api/reports/comparison  # Comparação de estratégias
```

### Exemplo de Uso da API
```javascript
// Criar nova configuração
const response = await fetch('/api/setups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Estratégia Conservadora',
    initialInvestment: 10000,
    operationsPerDay: 4,
    entryRate: 0.1,
    exitRate: 0.1,
    profitRate: 2.5,
    dailyRate: 0.2,
    projectionMonths: 24,
    startDate: '2024-01-01',
    includeWeekends: false
  })
})
```

## 🚀 Deploy

### Deploy com PM2 (Recomendado)
```bash
# Instale o PM2 globalmente
npm install -g pm2

# Build da aplicação
npm run build

# Inicie com PM2
pm2 start npm --name "simullakt" -- start

# Configure para iniciar com o sistema
pm2 startup
pm2 save
```

### Deploy com Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Variáveis de Ambiente de Produção
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/simullakt"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para todo novo código
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente APIs e componentes

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@itecnologys.com
- **Issues**: [GitHub Issues](https://github.com/itecnologys/SIMULLAKATT/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/itecnologys/SIMULLAKATT/wiki)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Recharts](https://recharts.org/) - Biblioteca de gráficos

---

**Desenvolvido com ❤️ pela equipe ITecnologys**

*Versão 2.0 - Agosto 2024*
