# Rutea

Primer incremento de la aplicación de turismo accesible en Costa Rica.

- `frontend/src` contiene React, el módulo de autenticación y el cliente HTTP.
- `backend/src` contiene Express con rutas, middlewares, controladores, servicios y modelos PostgreSQL.
- `database` contiene el esquema SQL y los datos iniciales.

## Inicio local

Requiere Node.js 24 y PostgreSQL 14 o posterior. Ejecuta estos comandos desde la carpeta que contiene `frontend`, `backend` y `database`.

```powershell
createdb -U postgres rutea
psql -v ON_ERROR_STOP=1 -U postgres -d rutea -f database/schema.sql
psql -v ON_ERROR_STOP=1 -U postgres -d rutea -f database/seed.sql
Copy-Item backend/.env.example backend/.env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Completa `DATABASE_URL` en `backend/.env` y guarda la salida del último comando en `JWT_SECRET`.

En una terminal, desde `backend`, ejecuta `npm ci` y `npm run dev`. En otra, desde `frontend`, ejecuta los mismos comandos y abre la URL que muestra Vite. Si cambias el puerto del backend, configura `RUTEA_API_TARGET` con su URL antes de iniciar Vite.

## Alcance del incremento

| Requisito | Estado |
| --- | --- |
| RF-01, RF-34, HU-01 | Registro público como viajero y aceptación de la versión de prueba con fecha. Ambas escrituras se realizan de forma atómica. |
| RF-02, RF-03, HU-02 | bcrypt, JWT de una hora y cierre de sesión que revoca el token en el servidor. El frontend guarda el token en memoria. Al recargar se debe volver a ingresar. |
| RF-06, RF-37 | Control de acceso por rol en Express, consulta de cuenta protegida y panel inicial por rol. Los paneles de trabajo se agregarán con cada módulo. |
| RF-33 | Textos de prueba visibles durante el registro. Quedan pendientes las políticas definitivas y sus pantallas. |

Quedan pendientes la recuperación de contraseña, el perfil, el catálogo, la comunidad, el pasaporte, la administración, la auditoría, la baja, los agentes y las integraciones.

## Verificación

Desde `backend`, ejecuta `npm test`. La suite usa un modelo de datos en memoria para probar la API HTTP. Desde `frontend`, ejecuta `npm run lint` y `npm run build`.
