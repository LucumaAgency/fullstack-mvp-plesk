#!/bin/bash

# Script de deploy para Plesk Git (branch production)
echo "🚀 Starting deployment..."
echo "📅 Date: $(date)"

# Verificar variables de entorno
if [ ! -f backend/.env ]; then
    echo "⚠️ Warning: .env file not found in backend/"
    echo "Please create it with database credentials"
fi

# Instalar dependencias de backend
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Limpiar cache si existe
npm cache clean --force 2>/dev/null || true

# El frontend ya viene compilado desde GitHub Actions
echo "✅ Frontend already built by GitHub Actions"

# Crear directorio de logs si no existe
mkdir -p ../logs

# Restart Node.js app
touch tmp/restart.txt

# Verificar health endpoint
sleep 3
if curl -f http://localhost:${PORT:-5000}/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "⚠️ Health check failed - check logs"
fi

echo "✅ Deployment complete at $(date)!"