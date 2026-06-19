# Start Date: 2026-09-06 second week

# End Date: 2026-09-23

**What I did:**

-created experimental branch to learn nest.js. Connected Supabase, try different layout for outh (w/o header and footer). Suppose this branch will never be merged but I'll proceed with nestjs when I have time

- optimized track-cards images, track-list layout and headings for better LCP and CLS

- refactor player layout: when user opens filters on search-page the palyer is minimized to a small widget, closing filters restore the player. Also user can minimaze and restore the size clicking on button

**Problems & SolutionsIssue**:

Track-cards on screens under 380px - I should decide on whether to make columns or to partially hide some info. Preferred to hide play count and duration

Much time was spent on understanding Layout shift culprits principles. CLS manifested bad results in the tracks-list - decision - min-hight for the whole list

- Significant loading time of tabs heading (were computed in the store) - solution: show headings on the upper level depending on route data

- removed lazy loading from the first tab
- add meta-description to index.html for better CEO
- scrollToTop on search-page - separated scroll of sidebar and content (not perfect, but much better)

- **Time spent:** 3-6 hour per day - total about 10 hours

- **Plans for the second week**

- dive into Nestjs
- substitute canActivate guard for canMatch
- refactor Auth
