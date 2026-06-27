# Start Date: 2026-23-06 first week

# End Date: 2026-29-06

**What I did:**

- update Node.js in ci-pipeline.yml and release.yml, add token for semantic release
- implement 4 variants of track-history: httpResource, rxResource, SignalStore, Signal State Object just to show the approaches to manage data to team-mates, 3 more old-school ways just to be discussed w/o code
- implement playlists.store with methods create, load, delete playlist. Configured routes for library page, refactor playlist model and form-fields (about 10 hours spent to compile front/back properties fields and refactor page structure because of the first experience in working with raw, not tested backend)

**Problems & SolutionsIssue**:
irritates to login every 15 minutes, need some refresh functionality from backend

1. The Problem (Initial State)
   While integrating the TrackCard into the new PlaylistViewPage, Ш noticed that the audio waveform (rendered via HTML5 Canvas in TrackWaveform) remained entirely empty for Jamendo. Upon debugging the lifecycle of Angular 21 reactive signals (input.required<number[]>() bound to [peaks]), I discovered that the frontend was perfectly wired up, but the data flowing from the NestJS backend was systematically corrupted or stripped down to empty arrays [].
2. Diving Into the Backend (The Root Causes) - Gemini greatly helped to untide this knot
   To fix this, we performed a deep-dive audit of the backend service (playlists.service.ts) and the data mapping layers. I discovered three critical architectural flaws:
   The simple-array Bottleneck: Local tracks were storing waveform peaks as a flat comma-separated string in PostgreSQL using TypeORM's simple-array.
   The mapper was forced to execute heavy .split(',').map(Number) routines on every single read operation.
   Hardcoded Payloads: For Jamendo streams, the backend mapper explicitly hardcoded waveform: [] and overrode the image paths with dead placeholders, wiping out the rich metadata (SVG waveforms, album covers) already captured on the frontend.
   Strict Validation Pipe Collisions: The backend TrackOrderPayloadDto enforced a strict @IsInt({ each: true }) validator.
   However, modern Web Audio APIs and audio processing utilities normalize amplitude peaks as floating-point decimals (e.g., 0.22, 0.45).
   This type mismatch caused immediate validation failures.3. Refactoring & Structural ImprovementsWe refactored the database schema and endpoints to ensure an unhindered end-to-end data transit:
   Migrated the waveform column to a native PostgreSQL integer array (@Column('int', { array: true })) to avoid slow string conversions and store binary numeric blocks directly.Standardized naming conventions by renaming the database column from url to audioUrl to match the frontend contract 1:1.Updated TrackOrderPayloadDto validation from @IsInt to @IsNumber({}, { each: true }) to fully support floating-point arrays.4. Current Roadblock: Preflight CORS FailureDespite fixing the data contracts and refactoring processTracksAndCalculateMetrics to prevent metadata loss, we cannot verify the end-to-end lifecycle yet because the frontend PATCH /playlists/:id request is currently blocked by a browser CORS policy:Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.The Cause: The backend controller was missing an await keyword before calling the asynchronous service layer. NestJS terminates the Express request lifecycle and cuts off the response stream before the global CORS middleware can inject the required Access-Control-Allow-Methods headers into the HTTP OPTIONS preflight response.Next Steps: Once the backend team ensures app.enableCors() is placed at the absolute top of main.ts and explicitly safelists PATCH and OPTIONS methods, the preflight block will lift. We will then resolve the merge conflicts from the history branch in our favor, locking down native arrays before proceeding to Angular CDK Drag & Drop.

- **Time spent:** 4-8 hour per day - total about 22 hours

- **Plans for the second week**
