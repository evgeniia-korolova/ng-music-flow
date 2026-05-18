# NgMusicFlow

## RSSchool Angular 2026Q2 Team Project: Jamendo Music Discovery

A collaborative web application built with Angular 21 for the RSSchool course. The project leverages the Jamendo API to provide users with a seamless music streaming and discovery experience, featuring advanced filtering, playlist management, and a modern UI.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Team members

- [Evgeniia Korolova](https://github.com/evgeniia-korolova) — Team Lead, Infrastructure, Architecture, Development
- [Merab Kopaleishvili](https://github.com/mero93) — Developer
- [Viktor Petsko](https://github.com/vitiok2021) — Developer

## 🚀 Stack

- **Framework:** Angular 21
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
   cd ..
   cd api && npm install
   ```

   **or in the root**
   This command installs both root tools (Husky, Linters), Angular client and NestJS api dependencies:

   ```bash
   npm run install-all
   ```

3. **Start local development:**

   ```bash
   npm start # (inside root folder)
   ```

## 🧪 Testing and Linting

- **Linting:** `npm run lint-all`
- **Testing:** `npm run test-all` (with Chromium Headless)
- **Formatting:** `cd client && npm run format`

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
