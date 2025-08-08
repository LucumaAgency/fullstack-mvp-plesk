#!/bin/bash

# Script de deploy para Plesk Git
echo "🚀 Starting deployment..."

# Frontend build
cd frontend
npm ci
npm run build
# Copiar build al directorio público
cp -r dist/* ../public/

# Backend setup
cd ../backend
npm ci --production

# Restart Node.js app (Plesk lo maneja)
touch tmp/restart.txt

echo "✅ Deployment complete!"