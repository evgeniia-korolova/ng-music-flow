# NgMusicFlow

## RSSchool Angular 2026Q2 Team Project: Jamendo Music Discovery

A collaborative web application built with Angular 21 for the RSSchool course. The project leverages the Jamendo API to provide users with a seamless music streaming and discovery experience, featuring advanced filtering, playlist management, and a modern UI.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Team members
- [Evgeniia Korolova](https://github.com/evgeniia-korolova) — Team Lead, Infrastructure, Architecture, Development
- [Merab Kopaleishvili](https://github.com/mero93) — Developer
- [Viktor Petsko](https://github.com/vitiok2021) — Developer

## 🚀 Stack
- **Framework:** Angular 21 (Zoneless mode)
- **State Management:** Signals / NgRx Signals
- **Styling:** SCSS + Tailwind CSS (planned)
- **Testing:** Vitest + Playwright (Browser Mode)
- **Automation:** Husky, Lint-staged, Semantic Release
- **API:** [Jamendo API](https://jamendo.com)



## Development server

1. **Clone repo:**
   ```bash
   git clone https://github.com
   cd ng-music-flow
   ```

2. **Install dependencies (in two folders):**
   ```bash
   npm install           
   cd client && npm install 
   ```
   **or in the root**
   This command installs both root tools (Husky, Linters) and Angular client dependencies:
   ```bash
   npm run install-all
   ```

3. **Start local development:**
   ```bash
   npm start # (inside client folder)
   ```

## 🧪 Testing and Linting


- **Linting:** `npm run lint`
- **Testing:** `npm run test:ci` (with Chromium Headless)
- **Formatting:** `npm run lint:fix` 

## 📋 Tasks management
All actual tasks, progress and backlog is on our [GitHub Project Board](https://github.com/users/evgeniia-korolova/projects/2/views/1).


## 🛡 Workflow
1. **Branching Strategy**: All features must be developed in separate branches branched off from `dev`.
2. **Commit Standards**: Use [Conventional Commits](https://conventionalcommits.org) (e.g., `feat: add player service`, `fix: handle api error`).
3. **Merging**: **Merging**: Direct pushes to `dev` and `main` are prohibited. 
   - All code must be merged via **Pull Request**.
   - At least one **Code Review** approval is required to merge into `dev`.
   - Final merge from `dev` to `main` happens at the end of the sprint.
4. **Pre-commit Checks**: Every commit is automatically verified by Husky (Linter + Tests). Please ensure your code passes all checks locally.


## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
