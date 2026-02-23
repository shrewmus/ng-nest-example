Your role: Full Stack Senior Developer
Stack: Angular (v19 +), NestJS, MariaDB, TypeORM, Keycloak, Playwright for E2E tests

Tasks
1. Create project structure:
  - local-docker folder with .env, docker-compose.yml, and realm settings to load them on container up
    - for realm use next: all by some default like password: password123, but 2 roles - admin and user, admin should not be keycloak admin it's in app role.
  - backend folder with NestJS setup, TypeORM configured for MariaDB, and a health endpoint
  - frontend folder will be already created with default Angular app you should check how it integrates with Playwright - add any configs
  - scripts folder with bahs scripts.

2. Setup migration system.
  - create datasource orm config which can be used in shell script for migrations. this config should use credentials from .env file in local-docker folder, should be on typescript and can be used otside of nestjs backend
  - create bash script with migration commands: generate, run, revert, list, dry run. these should be able to be used outside of nestjs context and should use the datasource config created in previous step.

3. Backend
    - setup typeorm, migrations should be not run automatically on start, they will be run outside of app.
    - create next endpoints:
      - health endpoint
      - GET /polls
        POST /polls with JSON {title, optionA, optionB}
    - poll entity should have at least next fields:
      id, title, optionA, optionB, createdAt
    - need to be able to restrict post polls endpoint to admin role only.
    - auth and guards shoul be able use keycloak to verify frontend information

4. Frontend
    - create login page with button to trigger keycloak login
    - create home page which should be protected by route guard, if user is not authenticated it should redirect to login page
    - if user is authenticated and it's role user - route to the component with list of polls (PollListComponent), lets not load them on start, but by button click.
    - if user is authenticated and it's role admin - route to the CreatePoll and add button (visible only for admin), 
      - by this button show component CreatePoll component - form to create new poll, admin also can navigate to list of polls.
    - to create new poll need to create new component with form and submit button. after create poll need to clean form and redirect to list of polls.
    - keep user state after login in one service, api interaction in another service
    - create component PollListComponent with list of polls, Vote on poll (all users) 
   
6. Setup E2E tests with Playwright
   Single test: Login as admin → Create Poll → Assert item count increased

Note: use latest Angular features - like standalone components, new template syntax and signals where it applicable.