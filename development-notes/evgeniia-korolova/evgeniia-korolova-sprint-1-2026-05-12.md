# Date: 2026-05-12

**What I did:**
During this sprint, I focused on setting up a robust project foundation and ensuring team collaboration efficiency:
- Architecture: Implemented **Feature-Sliced Design (FSD)** methodology to ensure scalability.
- Environments: Configured Angular environments and established a secure way to handle Jamendo API keys.
- Routing: Structured hierarchical routing with **Main Layouts** and **Lazy Loading** for some pages.
- Code Quality: Integrated **ESLint** and **Prettier** for consistent coding style.
- Git Hooks: Configured **Husky** and **lint-staged** to run linters automatically before each commit.
- CI/CD: Set up a basic **GitHub Actions** workflow to validate the build and linting on every Pull Request.

**Problems**:
-- **encountered difficulties with Vitest settings for ci/cd. Meanwile settled with the help of Gemini and repo of Rainer Hahnekamp**
-- **haven't completely understad how it should work with github and in browser**

**Solutions (or attempts):**
-- created test-setup.ts & vite.config.mts (took sample from Rainer Hahnekam project)
-- in test-setup.ts turned off browserMode (according to Gemini advise)

- **What I did:** ...

-  ...
- **Thoughts / plans:** what's next?
- **Time spent:** 3-6 hour per day



## Plan for Sprint 2
- Deploy the application to **Netlify** with environment variable injection.
- Coordinate the integration of team-developed features into the main layout.