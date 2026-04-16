# API Reference — Store Back

Base URL: `http://localhost:3000/api/v1`

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <accessToken>
```

---

## Índice

1. [Autenticación](#1-autenticación)
2. [Usuarios](#2-usuarios)
3. [Categorías](#3-categorías)
4. [Variantes de categoría](#4-variantes-de-categoría)
5. [Listings](#5-listings)
6. [Fotos de listings](#6-fotos-de-listings)
7. [Favoritos](#7-favoritos)
8. [Colecciones de favoritos](#8-colecciones-de-favoritos)
9. [Comentarios](#9-comentarios)
10. [Valoraciones](#10-valoraciones)
11. [Solicitudes de contacto](#11-solicitudes-de-contacto)
12. [Citas / Calendario](#12-citas--calendario)
13. [Reportes de listings](#13-reportes-de-listings)
14. [Búsqueda](#14-búsqueda)
15. [Configuración de contacto](#15-configuración-de-contacto)
16. [Documentos legales](#16-documentos-legales)
17. [Salud del sistema](#17-salud-del-sistema)
18. [Roles y permisos](#18-roles-y-permisos)
19. [Paginación](#19-paginación)
20. [Flujos de uso típicos](#20-flujos-de-uso-típicos)

---

## 1. Autenticación

### Registrar usuario
```
POST /auth/register
```
**Público.** Rate limit: 5 req/min.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPass123",
  "name": "Juan Pérez"
}
```

Reglas de contraseña: mínimo 8 caracteres, al menos una mayúscula y un número.

**Respuesta 201:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "role": "user"
  }
}
```

---

### Iniciar sesión
```
POST /auth/login
```
**Público.** Rate limit: 5 req/min.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPass123"
}
```

**Respuesta 200:** igual a register.

---

### Renovar token de acceso
```
POST /auth/refresh
```
**Público.** Rota el refresh token (el anterior queda inválido).

**Body:**
```json
{
  "refreshToken": "abc123..."
}
```

**Respuesta 200:** igual a login.

---

### Cerrar sesión
```
POST /auth/logout
```
**Público.** Revoca el refresh token.

**Body:**
```json
{
  "refreshToken": "abc123..."
}
```

**Respuesta 204** (sin cuerpo).

---

### Solicitar restablecimiento de contraseña
```
POST /auth/password-reset/request
```
**Público.** Rate limit: 3 req/min. Envía un correo con el token (silencioso si el email no existe).

**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta 204** (sin cuerpo).

---

### Confirmar restablecimiento de contraseña
```
POST /auth/password-reset/confirm
```
**Público.** Rate limit: 5 req/min.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "token": "token-del-email",
  "newPassword": "NuevaPass123"
}
```

**Respuesta 204** (sin cuerpo).

---

## 2. Usuarios

### Mi perfil
```
GET /users/me/profile
```
**Roles:** user, admin, owner.

**Respuesta 200:**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "user"
}
```

---

### Actualizar perfil
```
PATCH /users/me/profile
```
**Roles:** user, admin, owner.

**Body:**
```json
{
  "name": "Juan Carlos Pérez"
}
```

**Respuesta 200:** perfil actualizado.

---

### Cambiar contraseña
```
PATCH /users/me/password
```
**Roles:** user, admin, owner.

**Body:**
```json
{
  "currentPassword": "MiPass123",
  "newPassword": "NuevaPass456"
}
```

**Respuesta 204** (sin cuerpo).

---

### Mis listings
```
GET /users/me/listings
```
**Roles:** user, admin, owner. Soporta paginación.

**Respuesta 200:** página de listings del usuario autenticado.

---

### Mis favoritos
```
GET /users/me/favorites
```
**Roles:** user, admin, owner. Soporta paginación.

---

### Mis solicitudes de contacto enviadas
```
GET /users/me/contact-requests
```
**Roles:** user, admin, owner. Soporta paginación.

---

### Mis citas
```
GET /users/me/appointments
```
**Roles:** user, admin, owner. Soporta paginación.

---

### Listar todos los usuarios
```
GET /users
```
**Roles:** admin, owner. Soporta paginación.

**Respuesta 200:** página de usuarios.

---

### Activar / desactivar usuario
```
PATCH /users/:id/active
```
**Roles:** owner.

**Body:**
```json
{ "isActive": false }
```

**Respuesta 200:** usuario actualizado.

---

### Cambiar rol de usuario
```
PATCH /users/:id/role
```
**Roles:** owner.

**Body:**
```json
{ "role": "admin" }
```

Valores válidos: `user`, `admin`, `owner`.

**Respuesta 200:** usuario actualizado.

---

### Eliminar usuario
```
DELETE /users/:id
```
**Roles:** owner. Eliminación lógica (soft delete).

**Respuesta 204** (sin cuerpo).

---

## 3. Categorías

### Listar categorías (público)
```
GET /categories/public
```
**Público.** Caché 5 min. Soporta paginación.

**Respuesta 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Electrónica",
      "slug": "electronica",
      "description": "Dispositivos electrónicos",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": { "hasNextPage": false, "hasPreviousPage": false, "nextCursor": null, "previousCursor": null, "limit": 20 }
}
```

---

### Listar categorías (autenticado)
```
GET /categories
```
**Roles:** user, admin, owner. Soporta paginación.

---

### Obtener categoría por ID
```
GET /categories/:id
```
**Roles:** user, admin, owner.

---

### Crear categoría
```
POST /categories
```
**Roles:** admin, owner.

**Body:**
```json
{
  "name": "Electrónica",
  "slug": "electronica",
  "description": "Dispositivos electrónicos"
}
```

`slug` debe ser único. `description` es opcional.

**Respuesta 201:** categoría creada.

---

### Actualizar categoría
```
PATCH /categories/:id
```
**Roles:** admin, owner. Todos los campos son opcionales.

**Body:**
```json
{
  "name": "Electrónica y Tecnología",
  "description": "Celulares, computadores y más"
}
```

**Respuesta 200:** categoría actualizada.

---

### Eliminar categoría
```
DELETE /categories/:id
```
**Roles:** admin, owner.

**Respuesta 204** (sin cuerpo).

---

## 4. Variantes de categoría

Las variantes definen atributos configurables de un tipo de listing (ej: `marca`, `modelo`, `área_m2`).

### Listar variantes
```
GET /categories/:categoryId/variants
```
**Roles:** user, admin, owner.

**Respuesta 200:** array de variantes.
```json
[
  {
    "id": "uuid",
    "categoryId": "uuid",
    "name": "Marca",
    "key": "marca",
    "valueType": "text",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### Crear variante
```
POST /categories/:categoryId/variants
```
**Roles:** admin, owner.

**Body:**
```json
{
  "name": "Marca",
  "key": "marca",
  "valueType": "text"
}
```

`valueType` válidos: `text`, `number`, `boolean`, `select`.
`key` es único por categoría.
`valueType` es opcional (por defecto `text`).

**Respuesta 201:** variante creada.

---

### Actualizar variante
```
PATCH /categories/:categoryId/variants/:id
```
**Roles:** admin, owner. Todos los campos son opcionales.

**Respuesta 200:** variante actualizada.

---

### Eliminar variante
```
DELETE /categories/:categoryId/variants/:id
```
**Roles:** admin, owner.

**Respuesta 204** (sin cuerpo).

---

## 5. Listings

### Listar listings (público)
```
GET /listings
```
**Público.** Caché 60s. Soporta paginación, búsqueda y filtros.

**Respuesta 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "MCH9S3W2",
      "userId": "uuid",
      "categoryId": "uuid",
      "category": { "id": "uuid", "name": "Electrónica", "slug": "electronica" },
      "title": "iPhone 15 Pro Max",
      "description": "...",
      "price": 1100.00,
      "location": "Bogotá, Colombia",
      "sector": "Chapinero",
      "latitude": 4.711,
      "longitude": -74.072,
      "status": "active",
      "expiresAt": null,
      "isActive": true,
      "isBoosted": false,
      "boostedUntil": null,
      "createdAt": "...",
      "updatedAt": "...",
      "photos": [
        {
          "id": "uuid",
          "filename": "abc.webp",
          "url": "/api/v1/listings/uuid/photos/abc.webp",
          "thumbnailUrl": "/api/v1/listings/uuid/photos/abc_thumb.webp"
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "categoryVariantId": "uuid",
          "categoryVariantKey": "marca",
          "value": "Apple"
        }
      ]
    }
  ],
  "meta": { "hasNextPage": true, "hasPreviousPage": false, "nextCursor": "...", "previousCursor": null, "limit": 20 }
}
```

---

### Listings cercanos
```
GET /listings/nearby?lat=4.711&lng=-74.072&radius=10
```
**Público.** Caché 60s. Soporta paginación.

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `lat` | number string | Sí | Latitud (-90 a 90) |
| `lng` | number string | Sí | Longitud (-180 a 180) |
| `radius` | number string | No | Radio en km (1–500, default 10) |

**Respuesta 200:** misma estructura paginada que `/listings`.

---

### Listings en tendencia
```
GET /listings/trending?period=7d&limit=10
```
**Público.** Caché 5 min.

| Parámetro | Tipo | Valores | Default |
|-----------|------|---------|---------|
| `period` | string | `24h`, `7d` | `7d` |
| `limit` | number | 1–100 | 10 |

**Respuesta 200:** array de listings (sin paginación).

---

### Comparar listings
```
POST /listings/compare
```
**Público.**

**Body:**
```json
{
  "ids": ["uuid-1", "uuid-2", "uuid-3"]
}
```

Mínimo 2, máximo 4 IDs.

**Respuesta 200:** array de listings.

---

### Obtener listing por ID
```
GET /listings/:id
```
**Público.** Registra vista automáticamente.

---

### Obtener listing por código
```
GET /listings/code/:code
```
**Público.** Registra vista automáticamente.

---

### Estadísticas de listing
```
GET /listings/:id/stats
```
**Roles:** user (solo listing propio), admin, owner.

**Respuesta 200:**
```json
{
  "listingId": "uuid",
  "totalViews": 150,
  "viewsLast7Days": 42,
  "viewsLast30Days": 98,
  "uniqueViewers": 120,
  "favoritesCount": 15,
  "averageRating": 4.3,
  "ratingsCount": 8,
  "contactRequestsCount": 5
}
```

---

### Historial de precios
```
GET /listings/:id/price-history
```
**Roles:** user, admin, owner.

**Respuesta 200:**
```json
[
  {
    "id": "uuid",
    "listingId": "uuid",
    "price": "1500.00",
    "changedByUserId": "uuid",
    "changedAt": "2026-04-13T08:58:36.575Z"
  }
]
```

Cada entrada representa el precio anterior al momento del cambio.

---

### Crear listing
```
POST /listings
```
**Roles:** user, admin, owner.

**Body:**
```json
{
  "categoryId": "uuid",
  "title": "iPhone 15 Pro Max - Como Nuevo",
  "description": "Usado 2 meses, en perfecto estado. Incluye caja original y accesorios.",
  "price": 1100.00,
  "location": "Bogotá, Colombia",
  "sector": "Chapinero",
  "latitude": 4.7110,
  "longitude": -74.0721,
  "status": "active",
  "expiresAt": "2026-07-01T00:00:00Z",
  "variants": [
    {
      "categoryVariantId": "uuid",
      "value": "Apple"
    }
  ]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `categoryId` | uuid | Sí | Categoría existente |
| `title` | string | Sí | Máx 255 chars |
| `description` | string | Sí | Mín 10, máx 5000 chars |
| `price` | number | Sí | ≥ 0 |
| `location` | string | Sí | Máx 120 chars |
| `sector` | string | No | Máx 80 chars |
| `latitude` | number | No | -90 a 90 |
| `longitude` | number | No | -180 a 180 |
| `status` | string | No | `draft`, `active`, `reserved`, `sold`, `expired`, `suspended` (default `active`) |
| `expiresAt` | ISO date string | No | Fecha de expiración |
| `variants` | array | No | Valores de variantes de la categoría |

**Respuesta 201:** listing completo.

---

### Actualizar listing
```
PATCH /listings/:id
```
**Roles:** user (solo propio), admin, owner. Todos los campos son opcionales.

Si se cambia el precio, se registra el precio anterior en el historial.

**Respuesta 200:** listing actualizado.

---

### Impulsar listing (boost)
```
POST /listings/:id/boost
```
**Roles:** admin, owner.

**Body:**
```json
{
  "expiresAt": "2026-04-20T00:00:00Z"
}
```

`expiresAt` debe ser una fecha futura.

**Respuesta 201:** listing con `isBoosted: true` y `boostedUntil` actualizado.

---

### Exportar listings a CSV
```
GET /listings/export/csv
```
**Roles:** admin, owner. Soporta los mismos filtros y búsqueda que el listado.

**Respuesta 200:** archivo CSV adjunto con cabecera `Content-Disposition: attachment; filename="listings-YYYY-MM-DD.csv"`.

---

### Eliminar listing
```
DELETE /listings/:id
```
**Roles:** user (solo propio), admin, owner. Eliminación lógica (soft delete).

**Respuesta 204** (sin cuerpo).

---

## 6. Fotos de listings

### Subir fotos
```
POST /listings/:listingId/photos
```
**Roles:** user (solo listing propio), admin, owner. Rate limit: 20 req/min.

**Content-Type:** `multipart/form-data`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `photos` | File[] | Máx 10 archivos, máx 10 MB cada uno |

Tipos aceptados: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`.

Las imágenes se convierten a **WebP** y se genera una miniatura automáticamente.

**Respuesta 201:**
```json
[
  {
    "id": "uuid",
    "filename": "abc123.webp",
    "originalFilename": "abc123_original.jpeg",
    "url": "/api/v1/listings/uuid/photos/abc123.webp",
    "thumbnailUrl": "/api/v1/listings/uuid/photos/abc123_thumb.webp"
  }
]
```

---

### Listar fotos
```
GET /listings/:listingId/photos
```
**Público.**

**Respuesta 200:** array de fotos (mismo formato que la respuesta del upload).

---

### Obtener archivo de foto
```
GET /listings/:listingId/photos/:filename
```
**Público.** Sirve el archivo de imagen directamente (stream).

---

## 7. Favoritos

### Agregar a favoritos
```
POST /listings/:listingId/favorites
```
**Roles:** user, admin, owner. Retorna 409 si ya existe.

**Respuesta 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "listingId": "uuid",
  "createdAt": "..."
}
```

---

### Quitar de favoritos
```
DELETE /listings/:listingId/favorites
```
**Roles:** user, admin, owner.

**Respuesta 204** (sin cuerpo).

---

## 8. Colecciones de favoritos

### Crear colección
```
POST /favorites/collections
```
**Roles:** user, admin, owner.

**Body:**
```json
{ "name": "Mis apartamentos" }
```

`name`: 1–80 chars.

**Respuesta 201:**
```json
{
  "id": "uuid",
  "name": "Mis apartamentos",
  "createdAt": "..."
}
```

---

### Listar colecciones propias
```
GET /favorites/collections
```
**Roles:** user, admin, owner.

**Respuesta 200:** array de colecciones.

---

### Asignar favorito a colección
```
PATCH /favorites/collections/:listingId/collection
```
**Roles:** user, admin, owner.

**Body:**
```json
{ "collectionId": "uuid" }
```

Para desasignar, enviar `collectionId: null`.

**Respuesta 204** (sin cuerpo).

---

### Eliminar colección
```
DELETE /favorites/collections/:collectionId
```
**Roles:** user, admin, owner.

**Respuesta 204** (sin cuerpo).

---

## 9. Comentarios

### Listar comentarios
```
GET /listings/:listingId/comments
```
**Público.** Soporta paginación.

**Respuesta 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "listingId": "uuid",
      "content": "Excelente producto, muy bien descrito.",
      "userName": "Juan Pérez",
      "createdAt": "..."
    }
  ],
  "meta": { ... }
}
```

---

### Crear comentario
```
POST /listings/:listingId/comments
```
**Roles:** user, admin, owner. Rate limit: 5 req/min.

**Body:**
```json
{ "content": "¿Aún está disponible?" }
```

`content`: máx 2000 chars.

**Respuesta 201:** comentario creado con `userName` incluido.

---

## 10. Valoraciones

### Resumen de valoraciones
```
GET /listings/:listingId/ratings/summary
```
**Público.**

**Respuesta 200:**
```json
{ "avg": 4.5, "count": 12 }
```

---

### Listar valoraciones
```
GET /listings/:listingId/ratings
```
**Público.** Soporta paginación.

---

### Crear o actualizar valoración
```
POST /listings/:listingId/ratings
```
**Roles:** user, admin, owner. Si el usuario ya valoró, actualiza la puntuación.

**Body:**
```json
{ "score": 5 }
```

`score`: entero del 1 al 5.

**Respuesta 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "listingId": "uuid",
  "score": 5,
  "createdAt": "..."
}
```

---

## 11. Solicitudes de contacto

### Crear solicitud de contacto
```
POST /listings/:listingId/contact-requests
```
**Roles:** user, admin, owner. Rate limit: 3 req/min.

**Body:**
```json
{ "message": "Hola, me interesa el producto. ¿Tiene garantía?" }
```

`message` es opcional (máx 2000 chars).

**Respuesta 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "listingId": "uuid",
  "message": "...",
  "status": "pending",
  "respondedAt": null,
  "createdAt": "..."
}
```

---

### Actualizar estado de solicitud
```
PATCH /listings/:listingId/contact-requests/:id/status
```
**Roles:** user (solo si es dueño del listing), admin, owner.

**Body:**
```json
{ "status": "responded" }
```

Estados válidos: `pending`, `responded`, `closed`.

Al marcar como `responded`, se registra automáticamente `respondedAt`.

**Respuesta 200:** solicitud actualizada.

---

## 12. Citas / Calendario

### Listar citas de un listing
```
GET /listings/:listingId/calendar
```
**Roles:** user, admin, owner. Soporta paginación.

---

### Crear cita
```
POST /listings/:listingId/calendar
```
**Roles:** user, admin, owner.

**Body:**
```json
{
  "scheduledAt": "2026-04-25T10:00:00Z",
  "notes": "Por favor confirmar disponibilidad."
}
```

`scheduledAt` debe ser una fecha **futura** en formato ISO 8601.
`notes` es opcional (máx 1000 chars).

**Respuesta 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "listingId": "uuid",
  "scheduledAt": "2026-04-25T10:00:00.000Z",
  "status": "pending",
  "notes": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Actualizar cita
```
PATCH /listings/:listingId/calendar/:id
```
**Roles:** user, admin, owner. Todos los campos son opcionales.

**Body:**
```json
{
  "scheduledAt": "2026-04-26T14:00:00Z",
  "notes": "Reagendado"
}
```

**Respuesta 200:** cita actualizada.

---

### Eliminar cita
```
DELETE /listings/:listingId/calendar/:id
```
**Roles:** user, admin, owner.

**Respuesta 204** (sin cuerpo).

---

## 13. Reportes de listings

### Crear reporte
```
POST /listings/:listingId/reports
```
**Roles:** user, admin, owner. Rate limit: 3 req/min.

**Body:**
```json
{
  "reason": "spam",
  "details": "Este listing está duplicado y contiene información falsa."
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `reason` | string | Sí | `spam`, `fraud`, `inappropriate`, `duplicate`, `wrong_category`, `other` |
| `details` | string | No | Máx 1000 chars |

**Respuesta 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "listingId": "uuid",
  "reason": "spam",
  "details": "...",
  "status": "pending",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Listar todos los reportes
```
GET /reports
```
**Roles:** admin, owner. Soporta paginación.

---

### Actualizar estado de reporte
```
PATCH /reports/:reportId/status
```
**Roles:** admin, owner.

**Body:**
```json
{ "status": "reviewed" }
```

Estados válidos: `pending`, `reviewed`, `dismissed`, `action_taken`.

**Respuesta 200:** reporte actualizado.

---

## 14. Búsqueda

### Búsqueda unificada
```
GET /search?q=iphone&type=listing
```
**Público.**

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `q` | string | Sí | Término de búsqueda |
| `type` | string | No | `listing`, `category` o `listing,category` (default: ambos) |

**Respuesta 200:**
```json
{
  "data": [
    { "type": "listing", "id": "uuid", "title": "iPhone 15 Pro Max", "slug": null },
    { "type": "category", "id": "uuid", "title": "Electrónica", "slug": "electronica" }
  ],
  "total": 2
}
```

> La búsqueda retorna máx 10 resultados por tipo. Para búsqueda paginada completa usar `GET /listings?search=...`.

---

## 15. Configuración de contacto

### Obtener configuración
```
GET /contact/config
```
**Roles:** admin, owner.

**Respuesta 200:**
```json
{
  "id": "uuid",
  "recipientEmail": "contacto@mitienda.com",
  "subjectTemplate": "Nueva consulta: {{subject}}",
  "messageTemplate": "Tienes un mensaje de {{name}}: {{message}}",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Actualizar configuración
```
PUT /contact/config
```
**Roles:** admin, owner.

**Body:**
```json
{
  "recipientEmail": "contacto@mitienda.com",
  "subjectTemplate": "Nueva consulta: {{subject}}",
  "messageTemplate": "Tienes un mensaje de {{name}}: {{message}}"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `recipientEmail` | email | Sí | Email donde llegan las notificaciones |
| `subjectTemplate` | string | No | Asunto del email (máx 500 chars) |
| `messageTemplate` | string | No | Cuerpo del email |

**Respuesta 200:** configuración actualizada.

---

## 16. Documentos legales

### Listar documentos
```
GET /legal
```
**Público.** Caché 10 min.

**Respuesta 200:** array de documentos.
```json
[
  {
    "id": "uuid",
    "slug": "terminos-de-uso",
    "title": "Términos de Uso",
    "content": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### Obtener documento por slug
```
GET /legal/:slug
```
**Público.** Caché 10 min.

---

### Crear o actualizar documento
```
POST /legal
```
**Roles:** admin, owner. Invalida el caché automáticamente.

**Body:**
```json
{
  "slug": "politica-de-privacidad",
  "title": "Política de Privacidad",
  "content": "Respetamos tu privacidad y protegemos tus datos personales..."
}
```

| Campo | Tipo | Obligatorio | Límite |
|-------|------|-------------|--------|
| `slug` | string | Sí | Máx 50 chars, único |
| `title` | string | Sí | Máx 120 chars |
| `content` | string | Sí | Sin límite |

Si el `slug` ya existe, actualiza el documento. Si no existe, lo crea.

**Respuesta 200:** documento creado o actualizado.

---

## 17. Salud del sistema

```
GET /health
```
**Público.**

**Respuesta 200:**
```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "database": { "status": "up" } }
}
```

---

## 18. Roles y permisos

| Permiso | user | admin | owner |
|---------|:----:|:-----:|:-----:|
| Crear/leer/actualizar/eliminar sus propios listings | ✅ | ✅ | ✅ |
| Gestionar listings de cualquier usuario | ❌ | ✅ | ✅ |
| Exportar listings CSV | ❌ | ✅ | ✅ |
| Impulsar listings (boost) | ❌ | ✅ | ✅ |
| Ver estadísticas de listing propio | ✅ | ✅ | ✅ |
| Leer categorías | ✅ | ✅ | ✅ |
| Crear/actualizar/eliminar categorías | ❌ | ✅ | ✅ |
| Leer/crear/actualizar/eliminar variantes | ✅ (solo leer) | ✅ | ✅ |
| Ver y actualizar su propio perfil | ✅ | ✅ | ✅ |
| Listar todos los usuarios | ❌ | ✅ | ✅ |
| Activar/desactivar usuarios | ❌ | ❌ | ✅ |
| Cambiar rol de usuarios | ❌ | ❌ | ✅ |
| Eliminar usuarios | ❌ | ❌ | ✅ |
| Agregar/quitar favoritos y colecciones | ✅ | ✅ | ✅ |
| Crear comentarios | ✅ | ✅ | ✅ |
| Crear/actualizar valoraciones | ✅ | ✅ | ✅ |
| Crear solicitudes de contacto | ✅ | ✅ | ✅ |
| Actualizar estado de solicitudes (listing propio) | ✅ | ✅ | ✅ |
| Crear/ver/actualizar/eliminar citas | ✅ | ✅ | ✅ |
| Crear reportes de listings | ✅ | ✅ | ✅ |
| Revisar y gestionar reportes | ❌ | ✅ | ✅ |
| Leer/actualizar configuración de contacto | ❌ | ✅ | ✅ |
| Crear/actualizar documentos legales | ❌ | ✅ | ✅ |

> **Nota:** Los usuarios con rol `user` pueden actualizar y eliminar únicamente sus propios listings. La verificación de propiedad se aplica en el servidor.

---

## 19. Paginación

Todos los endpoints de lista usan paginación basada en cursor. Los parámetros se envían como query string.

### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `limit` | number | Resultados por página (1–100) |
| `cursor` | string | Cursor opaco de la respuesta anterior |
| `search` | string | Texto libre a buscar |
| `sort` | string | Regla de ordenamiento (ver formato abajo) |
| `filters[campo][$op]=valor` | — | Filtros por campo (ver operadores abajo) |

### Formato de sort

```
sort=createdAt:desc
sort=price:asc
```

### Operadores de filtro

| Operador | Descripción | Ejemplo |
|----------|-------------|---------|
| `$eq` | Igual | `filters[status][$eq]=active` |
| `$ne` | Distinto | `filters[status][$ne]=sold` |
| `$gt` | Mayor que | `filters[price][$gt]=500` |
| `$gte` | Mayor o igual | `filters[price][$gte]=500` |
| `$lt` | Menor que | `filters[price][$lt]=2000` |
| `$lte` | Menor o igual | `filters[price][$lte]=2000` |
| `$like` | Contiene (insensible a mayúsculas) | `filters[location][$like]=bogotá` |
| `$in` | En lista | `filters[status][$in][]=active&filters[status][$in][]=reserved` |
| `$null` | Es nulo | `filters[expiresAt][$null]=true` |

### Respuesta de paginación

```json
{
  "data": [ ... ],
  "meta": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "eyJpZCI6Ii4uLiJ9",
    "previousCursor": null,
    "limit": 20
  }
}
```

Para obtener la siguiente página: `GET /listings?cursor=eyJpZCI6Ii4uLiJ9&limit=20`.

---

## 20. Flujos de uso típicos

### Flujo 1: Publicar un listing

```
1. POST /auth/login              → obtener accessToken
2. GET  /categories/public       → elegir categoryId
3. GET  /categories/:id/variants → obtener variantIds para esa categoría
4. POST /listings                → crear listing con categoryId y variants[]
5. POST /listings/:id/photos     → subir fotos (multipart, campo "photos")
```

---

### Flujo 2: Buscar y contactar un vendedor

```
1. GET  /listings?search=iphone&filters[price][$lte]=1200&sort=price:asc
        → explorar resultados
2. GET  /listings/:id            → ver detalle (registra vista)
3. POST /listings/:id/ratings    → dejar valoración { "score": 5 }
4. POST /listings/:id/comments   → dejar comentario
5. POST /listings/:id/favorites  → guardar en favoritos

6. POST /auth/login              → autenticarse (si no está logueado)
7. POST /listings/:id/contact-requests → enviar consulta al vendedor
8. POST /listings/:id/calendar   → proponer cita { "scheduledAt": "...", "notes": "..." }
```

---

### Flujo 3: Gestionar solicitudes recibidas (vendedor)

```
1. GET /users/me/listings           → ver mis listings
2. GET /listings/:id/stats          → ver estadísticas de un listing
3. POST /listings/:id/contact-requests/:reqId/status  → responder con { "status": "responded" }
4. GET /listings/:id/calendar       → ver citas agendadas
5. PATCH /listings/:id/calendar/:id → confirmar cita { "status": "confirmed" }
```

---

### Flujo 4: Administración de la plataforma

```
1. POST /auth/login (con rol admin u owner)

# Usuarios
2. GET  /users                          → listar usuarios
3. PATCH /users/:id/active              → { "isActive": false }  suspender
4. PATCH /users/:id/role                → { "role": "admin" }    promover

# Contenido
5. POST /categories                     → crear categoría
6. POST /categories/:id/variants        → agregar variantes

# Moderación
7. GET  /reports                        → revisar reportes pendientes
8. PATCH /reports/:id/status            → { "status": "action_taken" }

# Boost
9. POST /listings/:id/boost             → { "expiresAt": "2026-05-01T00:00:00Z" }

# Export
10. GET /listings/export/csv            → descargar CSV
```

---

### Flujo 5: Gestión de favoritos con colecciones

```
1. POST /favorites/collections          → { "name": "Autos deportivos" }
2. POST /listings/:id/favorites         → agregar listing a favoritos
3. PATCH /favorites/collections/:listingId/collection
                                        → { "collectionId": "uuid" }  asignar a colección
4. GET  /users/me/favorites             → ver todos mis favoritos
5. DELETE /listings/:id/favorites       → quitar de favoritos
6. DELETE /favorites/collections/:id   → eliminar colección
```

---

## Códigos de respuesta HTTP

| Código | Cuándo se usa |
|--------|---------------|
| 200 | GET exitoso, PATCH/PUT que devuelve cuerpo |
| 201 | POST que crea un recurso |
| 204 | DELETE o PATCH/POST sin cuerpo de respuesta |
| 400 | Datos inválidos en la petición |
| 401 | Token ausente, inválido o expirado |
| 403 | Autenticado pero sin permiso para la operación |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: email duplicado, favorito duplicado) |
| 429 | Rate limit excedido |
| 500 | Error interno del servidor |

---

## Rate limits

| Endpoint | Límite |
|----------|--------|
| `POST /auth/login` | 5 req / min |
| `POST /auth/register` | 5 req / min |
| `POST /auth/password-reset/request` | 3 req / min |
| `POST /auth/password-reset/confirm` | 5 req / min |
| `POST /listings/:id/comments` | 5 req / min |
| `POST /listings/:id/contact-requests` | 3 req / min |
| `POST /listings/:id/reports` | 3 req / min |
| `POST /listings/:id/photos` | 20 req / min |
| Global (todos los endpoints) | 50 req / min |
