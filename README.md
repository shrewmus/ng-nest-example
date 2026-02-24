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

## Repository notes
- This is a test project, so `.env` files are intentionally committed.
- Lockfiles are intentionally committed for reproducible installs.

## Keycloak audience setup
To validate access tokens in backend, configure audience for the API client.

1. Set backend audience in `local-docker/.env`:
```env
KEYCLOAK_AUDIENCE=quickpoll-backend
```
2. In Keycloak Admin Console (`http://localhost:8081`, realm `quickpoll`):
   - Open `Client scopes`
   - Create a scope (type `Default`, protocol `openid-connect`) or use an existing one
   - Add mapper type `audience`
   - Set `Included Client Audience` to `quickpoll-backend`
   - Enable `Add to access token`
3. Assign that client scope to `quickpoll-frontend`.
4. Logout/login in frontend to get a new token.
5. Restart backend after env changes.

## Run locally
1. Start local services
```bash
scripts/local-stack.sh up
```

If DB credentials were changed after first startup, reset the DB volume once:
```bash
docker compose --env-file local-docker/.env -f local-docker/docker-compose.yml down -v
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
