# QuickPoll

## Structure
- `local-docker/`: MariaDB and Keycloak local stack + realm import
- `backend/`: NestJS API + TypeORM + migrations
- `frontend/`: Angular app + Keycloak auth + Playwright E2E
- `scripts/`: helper scripts (`local-stack.sh`, `migrations.sh`)

## Prerequisites
- Docker + Docker Compose
- Node.js 20+
- npm

## Run locally
1. Start local services
```bash
scripts/local-stack.sh up
```

2. Install backend and frontend dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Run migrations
```bash
scripts/migrations.sh run
```

4. Start backend
```bash
cd backend && npm run start:dev
```

5. Start frontend
```bash
cd frontend && npm start
```

## Default users
- Admin: `admin` / `password123`
- User: `user` / `password123`

## API
- Health: `GET http://localhost:3000/api/health`
- Polls list: `GET http://localhost:3000/api/polls` (auth required)
- Polls create: `POST http://localhost:3000/api/polls` (admin only)

## E2E
```bash
cd frontend && npm run e2e
```

## Migrations
```bash
scripts/migrations.sh generate CreateSomeChange
scripts/migrations.sh run
scripts/migrations.sh revert
scripts/migrations.sh list
scripts/migrations.sh dry-run
```
