#!/bin/bash

# Script para manter a aplicação Simulak rodando
cd /home/mini/workspace/Simulak

# Função para parar processos existentes
stop_app() {
    echo "Parando processos Next.js..."
    pkill -f "next" || true
    sleep 2
}

# Função para iniciar a aplicação
start_app() {
    echo "Iniciando aplicação Simulak..."
    echo "Data/Hora: $(date)"
    
    # Iniciar em background com logs
    nohup npx next dev -p 6500 > app.log 2>&1 &
    
    # Aguardar inicialização
    sleep 10
    
    # Verificar se está rodando
    if ps aux | grep -q "next dev -p 6500" | grep -v grep; then
        echo "✅ Aplicação iniciada com sucesso!"
        echo "🌐 URL: http://localhost:6500"
        echo "📊 Logs: tail -f app.log"
    else
        echo "❌ Falha ao iniciar aplicação"
        tail -10 app.log
    fi
}

# Função para monitorar e reiniciar se necessário
monitor_app() {
    while true; do
        if ! ps aux | grep -q "next dev -p 6500" | grep -v grep; then
            echo "🔄 Aplicação caiu, reiniciando..."
            stop_app
            start_app
        fi
        sleep 30
    done
}

# Executar
stop_app
start_app

# Iniciar monitoramento em background
monitor_app &
