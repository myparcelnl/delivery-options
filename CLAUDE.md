# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyParcel Delivery Options is a Vue 3 widget for e-commerce checkouts that displays delivery and pickup options to customers based on their location and merchant settings. It supports MyParcel (NL) and SendMyParcel (BE) platforms.

## Commands

```bash
# Install dependencies
yarn

# Download translations (required for sandbox)
yarn translations:import

# Development servers (sandbox at :9860, standalone at :5173)
yarn serve

# Build all packages
yarn build

# Run all tests in watch mode
yarn test

# Run tests once
yarn test:run

# Run tests with coverage
yarn test:coverage

# Update snapshots
yarn test:update

# Lint (affected files only)
yarn lint
yarn lint:fix

# Type checking
yarn typecheck
```

Individual workspace tests can be run directly with vitest:
```bash
cd apps/delivery-options && vitest run           # run once
cd apps/delivery-options && vitest run src/composables/useActiveCarriers.spec.ts  # single file
cd libs/shared && vitest run                     # shared lib tests
```

## Monorepo Structure

This is an Nx + Yarn workspaces monorepo:

- **`apps/delivery-options/`** — Main library published to npm as `@myparcel/delivery-options`
- **`apps/sandbox/`** — Demo app for interactive testing (private)
- **`libs/shared/`** — Shared types, validators, composables, and constants (`@myparcel-dev/do-shared`)
- **`libs/build-vite/`** — Shared Vite/build configuration

TypeScript path aliases (from `tsconfig.base.json`):
- `@myparcel-dev/delivery-options` → `./apps/delivery-options/src`
- `@myparcel-dev/do-shared/testing` → `./libs/shared/src/__tests__`
- `@myparcel-dev/do-*` → `./libs/*/src`

## Architecture

### Boot & Initialization

Entry point is `apps/delivery-options/src/main.ts` which calls `bootDeliveryOptions()`. This registers DOM event listeners on `document`:

1. Platform fires `myparcel_render_delivery_options` CustomEvent (with config in `event.detail`)
2. `initializeApp()` extracts config (from event detail or fallback `window.MyParcelConfig`)
3. `mountApp()` creates and mounts a Vue 3 app to the DOM

### Event-Driven Communication

The widget communicates with the host platform via custom DOM events (`apps/delivery-options/src/data/events.ts`):

- **Inbound**: `myparcel_render_delivery_options`, `myparcel_update_delivery_options`, `myparcel_disable_delivery_options`, `myparcel_show/hide_delivery_options`
- **Outbound**: `myparcel_updated_delivery_options` (selection changed), `myparcel_updated_address`, `myparcel_error_delivery_options`

### State Management

Uses Pinia stores in `apps/delivery-options/src/stores/`:
- `useConfigStore()` — holds the resolved `DeliveryOptionsConfig`
- `useAddressStore()` — holds the current address

### Key Source Directories (under `apps/delivery-options/src/`)

- **`views/`** — Vue page components. Root is `MyParcelDeliveryOptions.vue` with `Delivery/` and `Pickup/` subviews
- **`composables/`** — Business logic as Vue composables (e.g., `useResolvedDeliveryOptions`, `useSelectedValues`, `useActiveCarriers`, `useDeliveryMomentOptions`)
- **`utils/`** — Pure utility functions (cutoff time calculation, price retrieval, API parameter building)
- **`config/`** — Configuration initialization, validation, and platform defaults
- **`components/`** — Reusable UI components (buttons, form inputs, icons, loaders, map)

### Shared Library (`libs/shared/src/`)

- **`types/`** — Core TypeScript interfaces (`DeliveryOptionsConfig`, carrier types, address types)
- **`data/`** — Enums (`ConfigSetting`, `CarrierSetting`, `AddressField`) and default config factories
- **`validator/`** — Input validators built with `defineValidator()` pattern
- **`composables/`** — Shared composables (`useSdk`, `useCarrier`, `useLogger`, form input contexts)
- **`components/`** — Shared Vue components (form inputs, map, icons)

### Build Targets

The delivery-options app has multiple Vite build configs:
- `vite.config.ts` — ES + CJS modules (default)
- `vite-myparcel.config.ts` — UMD with Vue bundled (for script tag usage)
- `vite-myparcel-lib.config.ts` — UMD without Vue (for integration into Vue apps)

### Testing

Tests use Vitest with happy-dom and `@testing-library/vue`. Test files are colocated with source as `*.spec.ts`. Global test setup in `libs/shared/src/__tests__/vitest-setup.ts` mocks the SDK FetchClient and `@vueuse/core` memoization.

## Conventions

- Uses conventional commits for semantic-release
- ESLint config enforces sorted exports in index files and import ordering
- Pre-commit hooks (husky + lint-staged) run linting and prettier
- Package manager is Yarn 4 (Berry) — do not use npm
