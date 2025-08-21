# 📊 Módulo de Índices - Simulak

## 🎯 Descrição
Módulo independente para exibição de dados de mercados financeiros, incluindo criptomoedas, ações, índices, forex e commodities.

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
app/indices/
├── page.tsx              # Página principal
├── layout.tsx            # Layout com verificação de módulo
├── components/
│   └── IndicesGrid.tsx   # Grid de cards dos ativos
├── api/
│   └── route.ts          # API com dados mock
└── README.md             # Este arquivo
```

### Componentes Principais
- **IndicesErrorBoundary**: Isola erros do módulo
- **IndicesGrid**: Grid responsivo de cards
- **Configuração de Módulos**: Sistema de ativação/desativação

## 🔧 Configuração

### Ativar/Desativar Módulo
Edite `/config/modules.ts`:
```typescript
{
  id: "indices",
  name: "Índices de Mercado",
  enabled: true, // false para desativar
  path: "/indices",
  description: "Módulo de índices de mercado independente"
}
```

## 📊 Mercados Suportados

### 1. Criptomoedas (20 ativos)
- Bitcoin, Ethereum, Solana, XRP, Cardano
- Dogecoin, Polkadot, Avalanche, Shiba Inu
- E mais...

### 2. Ações (4 exemplos)
- Apple, Google, Microsoft, Tesla

### 3. Índices (3 principais)
- Ibovespa, S&P 500, Dow Jones

### 4. Forex (2 pares)
- USD/BRL, EUR/USD

### 5. Commodities (2 metais)
- Ouro, Prata

## 🎨 Layout dos Cards

Cada card exibe:
- **Ícone** do ativo (topo esquerdo)
- **Variação %** com seta (topo direito)
- **Nome** do ativo
- **Preço** em R$
- **Volume 24h** com unidade

## 🚀 Funcionalidades

### ✅ Implementado
- [x] Grid responsivo (2-5 colunas)
- [x] Filtros por mercado
- [x] Error boundary isolado
- [x] Dados mock realistas
- [x] Atualização automática (30s)
- [x] Sistema de módulos

### �� Próximas Funcionalidades
- [ ] Dados reais via APIs
- [ ] Gráficos interativos
- [ ] Alertas personalizados
- [ ] Análise técnica
- [ ] Histórico de preços

## 🔒 Isolamento de Erros

O módulo é completamente isolado:
- **Error Boundary**: Captura erros sem afetar a aplicação principal
- **API Independente**: Falhas não impactam outros módulos
- **Configuração Flexível**: Pode ser desativado facilmente

## 📱 Responsividade

- **Mobile**: 2 colunas
- **Tablet**: 3-4 colunas  
- **Desktop**: 5 colunas
- **Adaptativo**: Grid flexível

## 🎯 Como Usar

1. Acesse `/indices` na aplicação
2. Use os filtros para selecionar mercados
3. Visualize os cards com dados em tempo real
4. O módulo atualiza automaticamente

## 🔧 Desenvolvimento

### Adicionar Novo Ativo
Edite `app/indices/api/route.ts`:
```typescript
{
  id: "novo",
  symbol: "NOVO",
  name: "Novo Ativo",
  price: 100.00,
  change24h: 5.00,
  changePercent: 5.00,
  volume24h: 1000000,
  volumeUnit: "NOVO",
  category: "crypto", // ou "stocks", "indices", "forex", "commodities"
  icon: "🆕"
}
```

### Adicionar Novo Mercado
1. Adicione categoria em `IndicesGrid.tsx`
2. Atualize dados na API
3. Teste filtros

## 📞 Suporte

Em caso de problemas:
1. Verifique se o módulo está ativo em `/config/modules.ts`
2. Consulte logs da aplicação
3. O módulo pode ser desativado sem afetar o resto da aplicação

---
**Criado**: 21/08/2025
**Versão**: 1.0
**Status**: ✅ Funcional
