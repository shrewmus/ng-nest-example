# QuickPoll Implementation Plan

Primary guideline: `docs/initial.md`  
Reference only: `docs/QuickPoll – Pair‑Programming Mini Proj 1.md`

## Step-by-step
1. Align scope and freeze MVP
- Use `initial.md` as source of truth.
- Keep overlap from reference document only.
- Exclude vote flow for this phase.

2. Create target structure
- Add `local-docker/`, `backend/`, `scripts/`.
- Keep existing `frontend/` and adapt it.
- Add root README with run order.

3. Local infrastructure (`local-docker/`)
- Create `.env` for MariaDB, Keycloak, app values.
- Create `docker-compose.yml` for MariaDB + Keycloak.
- Add Keycloak realm import with roles (`admin`, `user`) and seed users.

4. Bootstrap backend NestJS app
- Initialize app in `backend/`.
- Configure TypeORM + MariaDB + env.
- Add `/health` endpoint.

5. Setup migration foundation (outside Nest runtime)
- Add standalone TypeORM datasource in TS.
- Read env from `local-docker/.env`.
- Disable migration auto-run at app startup.

6. Migration scripts (`scripts/`)
- Add bash commands: `generate`, `run`, `revert`, `list`, `dry-run`.
- Ensure scripts use standalone datasource.

7. Poll backend features
- Add `Poll` entity with `id,title,optionA,optionB,createdAt`.
- Add `GET /polls` and `POST /polls`.
- Add DTO validation for create payload.

8. Keycloak auth + roles
- Verify JWT from Keycloak.
- Protect authenticated routes.
- Restrict `POST /polls` to `admin` role.

9. Frontend auth integration
- Add login page and Keycloak login action.
- Add route guard with redirect to login for unauthenticated users.

10. Frontend components and routing
- Add `PollListComponent` (load by button click).
- Add admin-only create flow and `CreatePollComponent`.
- Reset form and redirect to list after successful create.

11. Playwright E2E
- Add Playwright config and one E2E scenario.
- Scenario: admin login -> create poll -> list count +1.

12. Verification and docs
- Verify full local flow (docker, migration, backend, frontend, e2e).
- Document commands and credentials in root README.
