# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS modular backend for e-commerce listings (real estate, vehicles, lots) without payment gateway. Uses PostgreSQL + TypeORM, JWT authentication, and cursor-based pagination throughout.

## Commands

```bash
# Development
npm run start:dev          # Start with watch mode
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled output

# Code quality (run both before closing any change)
npm run lint               # ESLint with auto-fix
npm run format             # Prettier format

# Testing
npm run test               # Unit tests
npm run test:watch         # Unit tests in watch mode
npm run test:cov           # Coverage report
npm run test:e2e           # E2E tests

# Migrations
npm run migration:run      # Apply migrations (builds first)
npm run migration:generate # Generate migration from entity changes (builds first)
npm run migration:revert   # Revert last migration
npm run migration:show     # List all migrations
npm run migration:create   # Create empty migration file
```

## Architecture

### Module Structure

Each feature module under `src/modules/` follows a flat directory pattern — no nested subdirectories:

```text
modules/<feature>/
├── controllers/       # HTTP handlers only — orchestrate request → use case → response DTO
├── dto/
│   ├── request/       # Named XxxCreateRequest, XxxUpdateRequest
│   └── response/      # Named XxxResponse (NOT "Dto" suffix)
├── entities/          # TypeORM entities
├── use-cases/         # ALL business logic lives here
├── services/          # Facades only — delegate to use cases; only created to expose to other modules
├── interfaces/        # Domain interfaces
├── <feature>.module.ts
└── index.ts           # Barrel export for types/services consumed by other modules
```

### Use Case Pattern (critical)

- **Use cases** contain all business logic. They inject `@InjectRepository(Entity)` directly and own one operation each (e.g., `CreateListingUseCase`, `FindListingByIdUseCase`).
- **Services** are facades only — they inject use cases and delegate; no business logic, no repository access.
- **Controllers** only orchestrate: receive request → call use case → return response DTO.
- No `repositories/` folder: use TypeORM `Repository<Entity>` directly in use cases.

### Modules

- `auth` — JWT + Passport strategies, guards, login/register use cases. Registers global `JwtAuthGuard` and `RolesGuard` via `APP_GUARD`.
- `users` — User entity and CRUD.
- `categories` — Categories + variants. Variants route: `categories/:categoryId/variants`.
- `listings` — Core module. Sub-features (all flat in the same module): photos, comments, ratings, favorites, contact-requests, calendar/appointments. Routes follow `listings/:listingId/<sub-resource>`.
- `contact` — Contact configuration.
- `legal` — Terms, policies, via slug.
- `shared` — Cursor pagination, security decorators/constants, file utilities, global filter/middleware.

### Global Guards

`JwtAuthGuard` and `RolesGuard` are global (all routes protected by default).

- `@Public()` — bypass JWT on a handler or controller.
- `@RequirePermissions()` — restrict to specific permissions. Do not repeat `@UseGuards(...)` on protected routes.
- `@CurrentUser()` — inject the authenticated user into a handler.

### Pagination

All list endpoints use **cursor-based pagination exclusively** — never offset-based.

Response shape: `{ data: T[], meta: { hasNextPage, hasPreviousPage, nextCursor, previousCursor, limit } }`

- Use `PaginationResponse<T>`, `PaginationQueryDto`, `ParsePaginationQueryPipe`, and `PaginationConfig<T>` from `src/shared/pagination`.
- `PaginationConfig<T>` accepts: `searchFields`, `defaultSort` (array of `{ field, order }`), and optionally `allowedFilters`, `deniedFilters`, `maxFilterDepth`. Do not use legacy keys (`alias`, `filterFields`, `defaultSortBy`/`defaultSortOrder`).
- Client sends: `filters[campo][$operator]=value`, `sort=campo:order`. Do not define per-resource filter DTOs.
- Use case receives `PaginationQueryDto` and returns `PaginationResult<Entity>`. Controller maps: `new PaginationResponse(result.data.map(e => new XxxResponse(e)), result.meta)`.

### HTTP Response Codes

- GET → 200 with DTO
- POST → 201 Created with DTO or created ID
- PUT/PATCH → 204 No Content or updated DTO
- DELETE → 204 No Content (no body)

Never return payloads like `{ success: true }` or `{ deleted: true }` — status code is sufficient.

### REST Routes

When a resource belongs to a parent, route from the parent: `parent/:parentId/child`. Use plural for collections. Use the same param name throughout the module (e.g., `:listingId`).

## Coding Standards

### Linting and Format

Run `npm run lint` first, then `npm run format`. Fix all errors before considering a change closed.

### Zero Comments

No `//` or `/** */` anywhere. If something needs explanation, improve naming or extract logic instead.

### SOLID

- **S** — One class/function, one reason to change.
- **O** — Extend via new use cases or DTOs; do not modify existing code.
- **L** — Interface implementations must be substitutable without breaking the contract.
- **I** — Small, specific interfaces; no fat interfaces that force unused dependencies.
- **D** — Depend on abstractions. High-level modules must not depend on implementation details.

### Strict Typing

- **No `any`** — use `unknown` with type narrowing (`typeof`, `in`, type guards).
- All parameters, return types, and complex variables must be explicitly typed.
- Use `interface` for object contracts; `type` for unions/aliases.
- **No `as` casting** except for exceptional library-integration cases.
- Always type callbacks: `(item: Entity) => XxxResponse`.

### Conditional Logic

- **No `else`** — use early returns; invert conditions and exit early.
- Max 2 levels of nesting; extract deeper conditions to private functions or use cases.
- Always use braces in `if` blocks — no single-line `if (x) return;` without braces.

### Naming

- No abbreviations — full names like `categoryRepository`, `listingRepository`, `legalDocumentRepository` (never `repo`, `listingRepo`).
- Functions/methods: verb + noun (`findById`, `createListing`).
- Booleans: `isActive`, `hasPermission`, `canEdit`.
- Request DTOs: `XxxCreateRequest`, `XxxUpdateRequest`.
- Response DTOs: `XxxResponse`.

### Async / Error Handling

- Always use `async/await`; no `.then()` in new code.
- Throw NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, etc.) — not `new Error()`.
- Never leave `catch (e) {}` empty; log and rethrow or transform.

### Code Quality

- Functions over ~20–30 lines: extract logic to private functions or named use cases.
- No magic literals; put meaningful strings/numbers in `constants/` or enums.
- Max ~3–4 parameters per method; group extras into an `interface` or DTO.
- Pure/getter functions must not mutate state or arguments.
- Layer order is strict: controller → use case → repository. Do not skip layers (e.g., no repository injection in controllers).

### One Export Type per File

Do not mix `const`, `interface`/`type`, and `class` in the same file. Each file exports one category:

- Constants → `*.constants.ts` (only `export const` / `export enum`)
- Interfaces/types → `*.interface.ts` / `*.types.ts`
- Classes → one class per file (or closely related classes together)
- Pure functions → `*.utils.ts` / `*.helpers.ts`
- Barrels (`index.ts`) may re-export from multiple files.

### Repository Usage

- `create()` and `save()` must be separate statements — never nest `create()` inside `save()`.
- No custom repository wrapper classes; use TypeORM `Repository<Entity>` directly.

### Module Format (Prettier)

- `printWidth: 120`.
- Arrays with more than one item: one element per line (`prettier-plugin-multiline-arrays`).
- NestJS module `imports`, `controllers`, `providers`: one item per line (vertical format).

## Environment Variables

Required (validated on startup via Joi in `src/config/env.validation.ts`):

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api
CORS_ORIGIN=*
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=store
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
UPLOADS_DIR=/app/uploads
```

## Database

- PostgreSQL via TypeORM; `synchronize: false` — always use migrations.
- `database/data-source.ts` is the TypeORM DataSource used by the CLI.
- `database/database.module.ts` is the global NestJS module (async config from `ConfigService`).
- 14 migrations already applied covering all current entities.
