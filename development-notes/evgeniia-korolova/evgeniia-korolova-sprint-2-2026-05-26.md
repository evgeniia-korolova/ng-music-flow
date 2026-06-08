# Date: 2026-05-26

**What I did:**

- Netlify deploy setup - key is only on Netlify, development via proxy
- implement responsive design for track-card, wave-form is shown only for screens over 767px
- implement responsive design for sidebar on search page
  -- implement SearchStore in two variants:

1. sorting by title and name via jamendo api (not satisfied)
2. with client-side sorting:

- Fix duplicate keys error (NG0955) by adding track ID deduplication
- Move sorting helpers from store to track.model
- Keep raw API response in state and move alphabet sorting to computed signals
- Fix sort direction issue and align arrow icons with book-order UX

--implement load more pagination
-- implement search-bar

-- SearchStore is provededIn: root to combine data from different layers, track-list is universal for DiscoveryPage and SearchPage

**Problems**:

- in Responsive service screen params are computed, also wave-form inside the track-card depends on the parent page, we plan to use it slider on actor's page, so I provide input data from the parent page to the track-list where it desides on showing wave-form. First I tryed to make a computed signal, realised it doestn't work until it's called in template. So I used LinkedSignal
- jamendo api doesn't provide sorting by name when fuzzytags is applyed. I implemented sorting by track title and artist name on client. 'Load More' button works, but new items are inserted throughout the list rather than at the bottom. Since the backend returns data in a different order (by relevance/popularity), client-side sorting pushes new tracks onto their alphabetical positions, which makes the layout shift and creates an unusual scrolling experience for the user."
  -- had issiue with AbortError: Transition was skipped - substituted router.navigate for location.replaceState(url)

- **Time spent:** 3-6 hour per day - total about 50 hours
