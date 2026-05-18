# Date: 2026-05-12

**What I did:**
During this sprint, I focused on setting up a project foundation and ensuring team collaboration efficiency:

- Architecture: Implemented **Feature-Sliced Design (FSD)** methodology to ensure scalability.
- Environments: Configured Angular environments and established a secure way to handle Jamendo API keys.
- Routing: Structured hierarchical routing with **Main Layouts** and **Lazy Loading** for some pages.
- Code Quality: Integrated **ESLint** and **Prettier** for consistent coding style.
- Git Hooks: Configured **Husky** and **lint-staged** to run linters automatically before each commit.
- CI/CD: Set up a basic **GitHub Actions** workflow to validate the build and linting on every Pull Request.
- install Zone.js
- created tracks-list and track-card with fake sound-wave
- get tracks data in the service and store in the signalStore (sorry that it comes up so early)
- tacks data is transferred from the list to the card by means of input()

**Problems**:
-- **encountered difficulties with Vitest settings for ci/cd. Meanwile settled with the help of Gemini and repo of Rainer Hahnekamp**
-- **haven't completely understad how it should work with github and in browser**
-- I believed that I can use the library wavesurfer.js, but understood that it'll be inaffective to preload all 20 track's mp3 so I dicided to create fake waves and later on substitute activeTrack wave for real

**Solutions (or attempts):**
-- created test-setup.ts & vite.config.mts (took sample from Rainer Hahnekam project)
-- in test-setup.ts turned off browserMode (according to Gemini advise)
-- then deleted this option at all
-- not to spoil performance I dicided to create fake waves and later on substitute activeTrack wave for real one

- ...
- **Thoughts / plans:** what's next?
- **Time spent:** 3-6 hour per day

## Plan for Sprint 2

- Deploy the application to **Netlify** with environment variable injection.
- Coordinate the integration of team-developed features into the main layout.
- configure lazy route for track details
- try to implement real sound wave
