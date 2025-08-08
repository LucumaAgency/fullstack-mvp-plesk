#!/bin/bash

# Script de deploy para Plesk Git (branch production)
echo "🚀 Starting deployment..."

# Instalar dependencias de backend
cd backend
npm ci --production

# El frontend ya viene compilado desde GitHub Actions
echo "✅ Frontend already built by GitHub Actions"

# Restart Node.js app
touch tmp/restart.txt

echo "✅ Deployment complete!"