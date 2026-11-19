# Rutea

Aplicación académica de turismo accesible en Costa Rica.

- `frontend/src` contiene React, navegación y módulos de interfaz.
- `backend/src` contiene Express con rutas, middlewares, controladores, servicios y modelos.
- `database` contiene el esquema, las migraciones y el catálogo inicial.
- `n8n` contiene los tres workflows. Los pasos de configuración están en [Integraciones](docs/integraciones.md).

## Demo local

Requiere Node.js 24. Desde la carpeta que contiene `frontend` y `backend`, ejecuta en una terminal:

```powershell
npm.cmd --prefix backend ci
npm.cmd --prefix backend run demo
```

En otra terminal:

```powershell
npm.cmd --prefix frontend ci
npm.cmd --prefix frontend run dev
```

Abre la URL que muestra Vite. La demo usa PostgreSQL embebido en memoria e incluye dos fichas con fuente. Puedes registrar un usuario de prueba, consultar el catálogo, guardar favoritos y registrar visitas. Los datos se reinician al cerrar el backend. La demo pública de tipo de cambio necesita internet. Para probar correo, IA y workflows con credenciales, usa la configuración persistente.

## Desarrollo con PostgreSQL

Crea una base vacía con PostgreSQL 14 o posterior. Si ya aplicaste `schema.sql` y `seed.sql` en la primera entrega, aplica únicamente las migraciones y el catálogo.

```powershell
createdb -U postgres rutea
psql -v ON_ERROR_STOP=1 -U postgres -d rutea -f database/schema.sql
psql -v ON_ERROR_STOP=1 -U postgres -d rutea -f database/seed.sql
Get-ChildItem database/migrations/*.sql | Sort-Object Name | ForEach-Object {
  psql -v ON_ERROR_STOP=1 -U postgres -d rutea -f $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "Falló la migración $($_.Name)" }
}
psql -v ON_ERROR_STOP=1 -U postgres -d rutea -f database/seed_catalog.sql
Copy-Item backend/.env.example backend/.env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Completa `DATABASE_URL` y guarda el valor generado en `JWT_SECRET`. Arranca con `npm.cmd --prefix backend run dev` y `npm.cmd --prefix frontend run dev`. Si cambias el puerto del backend, configura `RUTEA_API_TARGET` con su URL antes de iniciar Vite. Las credenciales permanecen en el backend y el frontend consume `/api` en el mismo origen.

Para crear la primera cuenta administradora, registra un correo de prueba desde la interfaz y promuévelo desde la consola de la base, sustituyendo el correo por la cuenta autorizada:

```sql
UPDATE users
SET role_id = (SELECT id FROM roles WHERE code = 'admin')
WHERE email = 'administracion@example.test';
```

El administrador puede asignar los roles de viajero, moderador y auditor desde Usuarios. Las cuentas de administración se aprovisionan desde la base. Vuelve a ingresar después de un cambio de rol para actualizar el menú.

## Verificación

Después de instalar ambas aplicaciones, ejecuta `npm.cmd test` desde esta carpeta. Incluye pruebas HTTP con PostgreSQL embebido y proveedores simulados, lint y compilación. La tabla de cobertura distingue las pruebas locales de las integraciones que requieren credenciales reales.

- [Modelo relacional y diccionario](docs/modelo-de-datos.md)
- [Fuentes del catálogo](docs/catalogo.md)
- [Integraciones, workflows y asistentes](docs/integraciones.md)
- [Cobertura de requisitos](docs/cobertura.md)
