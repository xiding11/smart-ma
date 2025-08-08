# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dittofeed is an open-source customer engagement platform that enables omni-channel messaging through email, SMS, mobile push, and webhooks. It's a developer-friendly alternative to platforms like Customer.io and OneSignal.

## Development Environment Commands

### Quick Start
```bash
# First time setup or reset
./dev-start.sh bootstrap

# Daily development
./dev-start.sh all

# Stop all services
./dev-start.sh stop
```

### Package Management
```bash
# Install all dependencies
yarn install

# Build all packages
yarn workspaces foreach run build

# Run specific package commands
yarn workspace dashboard dev
yarn workspace api dev
yarn workspace worker dev
```

### Testing
```bash
# Run all tests
yarn test

# Run tests for specific package
yarn workspace backend-lib test
yarn workspace dashboard test
yarn workspace api test

# Run tests with coverage
yarn test --coverage
```

### Linting and Type Checking
```bash
# Dashboard lint and type check
cd packages/dashboard
yarn lint
yarn check

# API type check
cd packages/api
yarn build-ts
```

### Admin CLI
```bash
# Bootstrap/migrate database
yarn admin bootstrap

# Access admin commands
yarn admin --help
```

## Project Architecture

### Monorepo Structure
- **packages/api**: REST API server (FastAPI-based)
- **packages/dashboard**: Next.js web dashboard
- **packages/worker**: Background job processing with Temporal
- **packages/backend-lib**: Shared backend logic and database schemas
- **packages/isomorphic-lib**: Shared utilities for frontend and backend
- **packages/admin-cli**: Command-line tools for administration
- **packages/lite**: Lightweight deployment configuration
- **packages/emailo**: Low-code email template editor

### Key Technologies
- **Frontend**: Next.js 13, React, MUI, Zustand
- **Backend**: Node.js, TypeScript, Drizzle ORM
- **Databases**: PostgreSQL, ClickHouse
- **Message Queue**: Temporal workflows
- **Authentication**: JWT-based auth
- **Deployment**: Docker, Docker Compose

### Database Schema
- PostgreSQL for transactional data (users, journeys, templates)
- ClickHouse for analytics and event data
- Drizzle ORM for schema management and migrations

## Development Workflow

### Service URLs
- Dashboard: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5432
- ClickHouse: localhost:8123 (HTTP), localhost:9000 (Native)
- Temporal UI: http://localhost:8080 (with temporal-ui profile)

### Environment Configuration
The project uses `.env` files for configuration. Key profiles in docker-compose.yaml:
- `temporal-ui`: Temporal Web UI
- `otel`: OpenTelemetry services
- `smtp`: MailHog email server
- `blob-storage`: MinIO object storage

### Code Patterns
- Use TypeScript throughout the codebase
- Drizzle ORM for database operations
- Temporal workflows for background processing
- React Query for API state management
- Zustand for client-side state management

## Testing Strategy

Jest is configured with separate projects for each package:
- `backend-lib`: Core business logic tests
- `dashboard`: Frontend component tests
- `api`: API endpoint tests

## Internationalization

The project supports i18n with next-intl:
- Messages stored in `packages/dashboard/messages/`
- Currently supports English (`en`) and Chinese (`zh`)
- Components use `useTranslations` hook for localized text

## Key Features to Understand

1. **Journey Builder**: Visual workflow editor for automated messaging campaigns
2. **Segment Builder**: Dynamic user segmentation based on traits and behaviors
3. **Template System**: MJML-based email templates with liquid templating
4. **Broadcast System**: One-time message sending to user segments
5. **Multi-channel Support**: Email, SMS, mobile push, webhooks
6. **Embedded Components**: Iframe and React component embedding capabilities