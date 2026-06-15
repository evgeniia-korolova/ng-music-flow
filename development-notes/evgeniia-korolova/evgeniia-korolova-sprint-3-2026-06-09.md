# Start Date: 2026-09-06

# End Date: 2026-09-23

**What I did:**

- implement global player
- refactor header - implement responsive designe. Cleaned up redundant DOM nodes and ensured strict compliance with W3C WAI-ARIA accessibility standards. Replaced heavy @HostListener decorators with dynamic RxJS fromEvent streams inside an Angular effect(). Events are now listened to only when the dropdown is open and unsubscribed automatically upon closing.

- Upgraded AutofocusDirective using input<boolean> signals and afterNextRender, enabling declarative focus trapping inside loops ([appAutofocus]="$index === 0").

**Problems & SolutionsIssue**:

On small screens (e.g., Galaxy S21 / 360px), the burger menu button was positioned incorrectly, and interactive buttons were overflowing the screen boundaries.
Solution: Utilized the CSS order property to visually shift the burger menu to the far right on mobile viewports without duplicating HTML nodes or breaking semantic layout order.

- **Time spent:** 3-6 hour per day - total about 20 hours
