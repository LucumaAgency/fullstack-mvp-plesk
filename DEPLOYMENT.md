# Guía de Deployment - Fullstack MVP Plesk

## Arquitectura
- **Frontend**: React + Vite (compilado en GitHub Actions)
- **Backend**: Node.js + Express + MySQL
- **Deploy**: GitHub Actions → Branch production → Plesk Git

## Configuración en Plesk

### 1. Base de Datos
1. Crear base de datos MySQL en Plesk
2. Importar `/database/init.sql`
3. Guardar credenciales

### 2. Variables de Entorno
En Plesk → Node.js → Environment Variables:
```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_database
NODE_ENV=production
ALLOWED_ORIGINS=https://tu-dominio.com
```

### 3. Git Repository
- URL: `https://github.com/tu-usuario/tu-repo.git`
- Branch: `production` (NO main)
- Deploy script: `.plesk-deploy.sh`
- ✅ Automatic deployment

### 4. Node.js Settings
- Document Root: `/httpdocs/public`
- Application Root: `/httpdocs`
- Application Startup File: `backend/index.js`

## Flujo de Deploy

1. **Desarrollo**: Hacer cambios en rama `main`
2. **Push**: `git push origin main`
3. **Build**: GitHub Actions compila frontend
4. **Deploy**: Se actualiza branch `production`
5. **Plesk**: Pull automático y restart

## Monitoreo

### Health Check
```bash
curl https://tu-dominio.com/health
```

### Logs
- Plesk → Node.js → Log Files
- Ver errores y accesos

## Troubleshooting

### Backend no responde
1. Verificar logs en Plesk
2. Revisar variables de entorno
3. Comprobar conexión a DB
4. Restart aplicación

### Error 502
- Backend no está corriendo
- Puerto incorrecto en nginx
- Falta configuración Passenger

### Base de datos
- Verificar credenciales en .env
- Comprobar que tabla `notes` existe
- Revisar permisos de usuario DB

## Comandos Útiles

```bash
# Verificar estado
curl http://localhost:5000/health

# Ver logs
tail -f /var/log/nginx/error.log

# Restart manual
touch /httpdocs/backend/tmp/restart.txt
```

## Seguridad

- ✅ CORS configurado
- ✅ Variables en .env (no en código)
- ✅ Error handling sin exponer detalles
- ✅ Pool de conexiones DB
- ✅ Health check endpoint