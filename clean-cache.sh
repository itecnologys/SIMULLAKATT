#!/bin/bash

echo "🧹 === LIMPANDO CACHE NEXT.JS ==="

# Parar processos Next.js
echo "🛑 Parando processos Next.js..."
pkill -f "next" 2>/dev/null || true
sleep 2

# Limpar cache
echo "🗑️ Removendo diretório .next..."
rm -rf .next 2>/dev/null || true

echo "🗑️ Removendo cache do npm..."
npm cache clean --force 2>/dev/null || true

echo "🗑️ Removendo node_modules/.cache..."
rm -rf node_modules/.cache 2>/dev/null || true

echo "🗑️ Removendo .next/cache..."
rm -rf .next/cache 2>/dev/null || true

# Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install --legacy-peer-deps

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Iniciar servidor
echo "🚀 Iniciando servidor..."
PORT=3001 npm run start &

echo "✅ Cache limpo e servidor iniciado!"
echo "🌐 Disponível em: http://100.98.116.47:3001/"
echo "📊 Dashboard com Market Ticker: http://100.98.116.47:3001/dashboard" 