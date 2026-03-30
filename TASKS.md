# Task List — Store Backend Improvements

> Estado: `[ ]` pendiente · `[~]` en progreso · `[x]` completado

---

## 🔴 Crítico — Seguridad y Bugs

- [x] **T01** · Ownership check en Update/Delete listing — cualquier admin puede editar o borrar listings ajenos
- [x] **T02** · Rate limiting en `POST /auth/login` — sin protección contra fuerza bruta
- [x] **T03** · `forbidNonWhitelisted: true` en ValidationPipe — campos extra ignorados silenciosamente
- [x] **T04** · Límite de tamaño en subida de fotos — sin `fileSize` limit, posible DoS
- [x] **T05** · Citas (`/calendar`) públicas exponen fechas/notas — debe requerir auth
- [x] **T06** · Unique constraint en BD para `favorites(userId, listingId)` y `ratings(userId, listingId)`
- [x] **T07** · `UpsertLegalDocumentUseCase` bloquea al rol `admin` aunque tiene el permiso — rol check hardcodeado contradice `role-permissions.ts`
- [x] **T08** · `ContactConfig` sin singleton en BD — puede tener múltiples filas
- [x] **T09** · `status` de cita sin validación de enum — acepta cualquier string
- [x] **T10** · `scheduledAt` acepta fechas pasadas — sin validación de fecha futura

---

## 🟠 Importante — Funcionalidad y Arquitectura

- [x] **T11** · Job de expiración automática de listings — `expiresAt` no cambia el `status` a `expired`
- [x] **T12** · Validación de rango en coordenadas — `latitude` [-90,90] y `longitude` [-180,180]
- [x] **T13** · Paginación en endpoints que devuelven arrays planos (`/me/favorites`, `/me/appointments`, `/me/contact-requests`, `/listings/:id/calendar`, `/categories/:id/variants`)
- [x] **T14** · Transacciones en `CreateListingUseCase` y `UpdateListingUseCase` — estado inconsistente si falla a mitad
- [x] **T15** · N+1 en `UpdateListingUseCase` — borrar y guardar variants uno a uno en loops
- [x] **T16** · Índices en foreign keys frecuentes — `listings.userId`, `listings.categoryId`, `comments.listingId`, `ratings.listingId`, `favorites.userId`
- [x] **T17** · `ListingPhoto.url` relativa en BD — si cambia el prefix/dominio, todas las URLs rompen
- [x] **T18** · Campo `respondedAt` / `status` en `ContactRequest` — sin forma de marcar solicitudes como atendidas
- [x] **T19** · Endpoint para activar/desactivar usuarios (admin) — `isActive` existe pero sin endpoint

---

## 🟡 Mejoras de calidad y nuevas ideas

- [x] **T20** · Versionado de API — agregar `/api/v1/` prefix
- [x] **T21** · Validación de complejidad de contraseña — solo `MinLength(6)` actualmente
- [x] **T22** · Slug de categoría inmutable — se puede cambiar via PATCH rompiendo referencias
- [x] **T23** · Soft delete en listings y usuarios — borrado permanente actual
- [x] **T24** · Búsqueda geográfica — `/listings?near=lat,lng&radius=km` usando lat/lng existentes
- [x] **T25** · `updatedAt` falta en `UserResponseDto` — se selecciona pero no se expone
- [x] **T26** · Validación de `valueType` en variants — acepta cualquier string, debería ser enum
- [x] **T27** · Foto original preservada antes de procesar con Sharp — sin fallback si se quiere re-procesar
- [x] **T28** · `GET /categories/public` sin paginación — retorna todo sin límite
- [x] **T29** · Endpoint `GET /listings/:id/ratings` devuelve solo avg+count — agregar lista paginada de ratings individuales
- [x] **T30** · Sin `PATCH /users/:id/role` para que owner cambie roles — solo se puede via BD directa

---

## Log de cambios

| Tarea | Fecha | Nota |
|-------|-------|------|
| — | 2026-03-30 | Archivo creado |
