# QuickPoll – Pair‑Programming Mini Project

> **Goal:** In a **45‑minute** Pair‑Programming session using an **IDE with LLM assistance**, you build a minimal full-stack app using the following stack:  
> **Angular (v19 +), NestJS, MariaDB, TypeORM, Keycloak, and E2E testing via Cypress or Playwright.**

---

## 📋 1. Quick Overview
- The app is called **QuickPoll**.
- A regular user (not admin) logs in via **Keycloak**.
- Calls a REST endpoint to fetch a list of polls.
- An admin can create a new poll (title + two answer options).
- After submission, everyone sees the new poll in the updated list.
- Frontend and backend uses the local **MariaDB**, running in **Docker** via **TypeORM migrations**, and covered by a single **E2E test** verifying the creation of a poll.

---

## 🔧 2. Feature Scope (MVP)

| Layer            | Requirement                                                                 |
|------------------|------------------------------------------------------------------------------|
| **Keycloak**     | *Realm*: `use the existing`<br>*Client*: `use the existing` (public)<br>*Roles*: `user`, `admin` |
| **NestJS API**   | `GET /polls`<br>`POST /polls` with JSON `{title, optionA, optionB}`<br>Protected with appropriate guard
| **MariaDB + TypeORM** | `Poll` entity with these fields: `id, title, optionA, optionB, createdAt`<br>Migration to create table
| **Angular Frontend** | Login button<br>Poll list view component (all users)<br>Modal form dialog to create new poll (admin only)<br>Vote on poll (all users)
| **E2E Test**     | Single test: Login as admin → Create Poll → Assert item count increased<br>Use Cypress or Playwright

⌛ Timebox guideline: **API 15 min**, **DB/Migrations 5 min**, **Guard 5 min**, **Frontend 15 min**, **E2E 5 min**

---

## 🧪 3. Pair‑Programming Flow

### Backend & DB (**10–15 min**)
- Define the `Poll` entity and generate/run a migration.
- Implement controller and service with stubs for REST endpoints.
- Add an appropriate guard (NestJS passport, AuthGuard or Keycloak guard) to protect the endpoints.

### Frontend (**~15 min**)
- Build `PollListComponent` to call GET `/polls` and render as list/table.
- As for admin: Create a modal form dialog `CreatePoll` which POSTs JSON and updates the list.
- For regular user: Allow to login and see the list of polls, if the user clicks on a poll, navigate to the poll details page and allow the user to vote on the poll.

### E2E Test (**~5 min**)
- With Cypress or Playwright, implement an end-to-end test:
  - Custom login via UI or stubbing.
  - Assert that the list length increments by +1 after poll creation.