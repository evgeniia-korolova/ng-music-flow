# NgMusicFlow

## RSSchool Angular 2026Q2 Team Project: Jamendo Music Discovery

A collaborative web application built with Angular 21 for the RSSchool course. The project leverages the Jamendo API to provide users with a seamless music streaming and discovery experience, featuring advanced filtering, playlist management, and a modern UI.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Team members

- [Evgeniia Korolova](https://github.com/evgeniia-korolova) — Team Lead, Infrastructure, Architecture, Development
- [Merab Kopaleishvili](https://github.com/mero93) — Developer
- [Viktor Petsko](https://github.com/vitiok2021) — Developer

## 🏗 Architecture

The project follows a modular Angular architecture with separation between:

- shared UI components
- feature-level business logic
- API/data access layer
- reusable services and utilities

Signals are used as the primary reactive mechanism across the application.

## 🚀 Stack

- **Framework:** Angular 21 (Zone mode)
- **State Management:** Signals / NgRx Signals
- **Styling:** SCSS + Tailwind CSS
- **Testing:** Vitest + Playwright (Browser Mode)
- **Automation:** Husky, Lint-staged, Semantic Release
- **API:** [Jamendo API](https://jamendo.com)

## ✨ Features

- Music discovery via Jamendo API
- Audio playback with waveform visualization
- Artists and tracks browsing
- Theme switching
- Responsive UI
- Advanced filtering and search
- Modern Angular Signals-based architecture

## 📸 Screenshots

### Home Page

![Home Page](./public/screenshots/home-page.png)

### Artists Page

![Home Page](./public/screenshots/artists-page.png)

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
- **Testing:** `npm run test` (with Chromium Headless)
- **Formatting:** `npm run lint:fix`

## 📋 Tasks management

All current tasks, progress, and backlog are tracked on our [GitHub Project Board](https://github.com/users/evgeniia-korolova/projects/2/views/1).

## 🛡 Workflow

1. **Branching Strategy**: All features must be developed in separate branches branched off from `dev`.
2. **Commit Standards**: Use [Conventional Commits](https://conventionalcommits.org) (e.g., `feat: add player service`, `fix: handle api error`).
3. **Merging**: Direct pushes to `dev` and `main` are prohibited.
   - All code must be merged via **Pull Request**.
   - At least one **Code Review** approval is required to merge into `dev`.
   - Final merge from `dev` to `main` happens at the end of the sprint.
4. **Pre-commit Checks**: Every commit is automatically verified by Husky (Linter + Tests). Please ensure your code passes all checks locally.
