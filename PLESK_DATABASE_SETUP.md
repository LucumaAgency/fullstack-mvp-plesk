# Configuración de Base de Datos en Plesk

## Paso 1: Crear la Base de Datos

1. Inicia sesión en tu panel de Plesk
2. Ve a **"Bases de datos"** en el menú lateral
3. Haz clic en **"Agregar base de datos"**
4. Completa los siguientes campos:
   - **Nombre de la base de datos**: `fullstack_db`
   - **Sitio relacionado**: Selecciona tu dominio (fullstack-mvp-plesk.pruebalucuma.site)
   
## Paso 2: Crear Usuario de Base de Datos

1. En la misma pantalla, en la sección **"Usuarios de base de datos"**
2. Haz clic en **"Agregar usuario de base de datos"**
3. Completa:
   - **Nombre de usuario**: `fullstack_user`
   - **Contraseña**: Genera una contraseña segura (ejemplo: `FullStack@2024DB!`)
   - **Confirmar contraseña**: Repite la contraseña
   - **Acceso**: Selecciona "Permitir acceso local solamente"
   
## Paso 3: Asignar Permisos

1. Asegúrate de que el usuario tenga **todos los permisos** sobre la base de datos:
   - SELECT, INSERT, UPDATE, DELETE
   - CREATE, DROP, ALTER
   - INDEX, REFERENCES
   
## Paso 4: Obtener Información de Conexión

Una vez creada, toma nota de:
- **Host**: `localhost` (o el host que te muestre Plesk)
- **Puerto**: `3306` (por defecto)
- **Base de datos**: `fullstack_db`
- **Usuario**: `fullstack_user`
- **Contraseña**: La que generaste

## Paso 5: Crear las Tablas

1. En Plesk, haz clic en el nombre de tu base de datos
2. Haz clic en **"phpMyAdmin"** o **"Webadmin"**
3. Una vez dentro, ve a la pestaña **"SQL"**
4. Ejecuta este script:

```sql
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de prueba (opcional)
INSERT INTO notes (content) VALUES 
('Primera nota de prueba'),
('Segunda nota de prueba');
```

## Paso 6: Actualizar Configuración del Backend

1. En el administrador de archivos de Plesk, navega a:
   `/httpdocs/backend/` (o donde esté tu backend)

2. Edita el archivo `.env` con estos valores:

```env
DB_HOST=localhost
DB_USER=fullstack_user
DB_PASSWORD=FullStack@2024DB!
DB_NAME=fullstack_db
PORT=5000
```

3. Edita `package.json` y cambia:
   ```json
   "main": "app.js",
   ```
   (en lugar de `app-memory.js`)

## Paso 7: Reiniciar la Aplicación

1. Ve a **"Node.js"** en Plesk
2. Encuentra tu aplicación
3. Haz clic en **"Reiniciar aplicación"**

## Verificación

Para verificar que todo funciona:

1. Visita: `https://fullstack-mvp-plesk.pruebalucuma.site/api/health`
   - Deberías ver un JSON con `status: "OK"`

2. Visita: `https://fullstack-mvp-plesk.pruebalucuma.site/api/notes`
   - Deberías ver las notas de la base de datos

## Troubleshooting

Si hay errores de conexión:

1. **Verifica el host**: A veces en Plesk el host no es `localhost` sino algo como:
   - `localhost:3306`
   - `127.0.0.1`
   - Un nombre de servidor específico

2. **Verifica los permisos**: El usuario debe tener permisos sobre la base de datos

3. **Verifica el firewall**: Asegúrate de que el puerto 3306 esté accesible localmente

4. **Revisa los logs**: En Plesk, ve a **"Logs"** > **"Log de errores de Node.js"**

## Credenciales de Ejemplo para Esta Instalación

```
DB_HOST=localhost
DB_USER=fullstack_user
DB_PASSWORD=FullStack@2024DB!
DB_NAME=fullstack_db
```

**IMPORTANTE**: Cambia la contraseña por una segura y única.