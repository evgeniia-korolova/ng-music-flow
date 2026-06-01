# Date: 2026-05-26

**What I did:**

- Netlify deploy setup - key is only on Netlify, development via proxy
- implement responsive design for track-card, wave-form is shown only for screens over 767px
  -- implement responsive design for sidebar on search page

**Problems**:

- in Responsive service screen params are computed, also wave-form inside the track-card depends on the parent page, we plan to use it slider on actor's page, so I provide input data from the parent page to the track-list where it desides on showing wave-form. First I tryed to make a computed signal, realised it doestn't work until it's called in template. So I used LinkedSignal

- **Time spent:** 3-6 hour per day - total about 30 hours
