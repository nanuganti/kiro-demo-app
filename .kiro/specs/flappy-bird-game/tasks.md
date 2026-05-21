# Implementation Plan: Flappy Bird Game

## Overview

Implementation tasks for the Flappy Bird game built as a Next.js web application. Tasks are ordered to build up the game incrementally: project setup → data models and pure logic → React component and game loop → rendering → testing.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4"] },
    { "wave": 5, "tasks": ["5"] },
    { "wave": 6, "tasks": ["6", "7"] },
    { "wave": 7, "tasks": ["8"] },
    { "wave": 8, "tasks": ["9"] },
    { "wave": 9, "tasks": ["10", "11", "12"] }
  ]
}
```

## Tasks

- [x] 1. Project setup and dependencies
  - [x] 1.1 Verify or scaffold a Next.js project with TypeScript support (app router or pages router)
  - [x] 1.2 Install `fast-check` as a dev dependency for property-based testing
  - [x] 1.3 Install `vitest` and configure it as the test runner (or confirm Jest is configured)
  - [x] 1.4 Install a canvas mock library (`jest-canvas-mock` or equivalent) for render tests
  - [x] 1.5 Create the directory structure: `src/components/`, `src/game/`, `src/game/__tests__/`

- [x] 2. Define data models and game configuration
  - [x] 2.1 Create `src/game/types.ts` with `GameConfig`, `Bird`, `Pipe`, `GamePhase`, and `GameState` interfaces matching the design document
  - [x] 2.2 Create `src/game/config.ts` exporting the default `GameConfig` constant (canvasWidth: 400, canvasHeight: 600, gravity: 1500, flapVelocity: -500, birdSpeed: 200, pipeWidth: 60, gapHeight: 150, pipeInterval: 250, minGapY: 60, maxGapY: 390, targetFPS: 60)
  - [x] 2.3 Create `src/game/initialState.ts` exporting a `createInitialState(config: GameConfig): GameState` factory that initializes bird at x = canvasWidth * 0.25, y = canvasHeight / 2, vy = 0, phase = 'START', score = 0, pipes = []

- [x] 3. Implement pure physics subsystem functions
  - [x] 3.1 Implement `applyPhysics(bird: Bird, dt: number, config: GameConfig): Bird` in `src/game/physics.ts` — applies gravity (vy += gravity * dt), updates y position, clamps y to [0, canvasHeight], zeroes vy if y reaches top boundary
  - [x] 3.2 Implement `applyFlap(bird: Bird, config: GameConfig): Bird` in `src/game/physics.ts` — sets vy to config.flapVelocity regardless of current vy
  - [x] 3.3 Implement `resetGame(state: GameState, config: GameConfig): GameState` in `src/game/physics.ts` — returns a fresh initial state with score = 0 and pipes = []

- [x] 4. Implement pipe management subsystem functions
  - [x] 4.1 Implement `spawnPipe(config: GameConfig): Pipe` in `src/game/pipes.ts` — generates a random gapY clamped to [minGapY, maxGapY], sets x = canvasWidth, passed = false
  - [x] 4.2 Implement `updatePipes(pipes: Pipe[], dt: number, config: GameConfig): Pipe[]` in `src/game/pipes.ts` — decrements each pipe's x by birdSpeed * dt, filters out pipes where x + pipeWidth <= 0

- [x] 5. Implement collision detection and scoring
  - [x] 5.1 Implement `checkCollision(bird: Bird, pipes: Pipe[], config: GameConfig): boolean` in `src/game/collision.ts` — returns true if bird bounding box overlaps any upper or lower pipe segment, or if bird.y + bird.height / 2 >= canvasHeight
  - [x] 5.2 Implement `updateScore(score: number, bird: Bird, pipes: Pipe[], config: GameConfig): { score: number; pipes: Pipe[] }` in `src/game/scoring.ts` — increments score by 1 and marks pipe.passed = true for each pipe where bird.x > pipe.x + pipeWidth and pipe.passed === false

- [ ] 6. Implement the renderer
  - [x] 6.1 Implement `render(ctx: CanvasRenderingContext2D, state: GameState, config: GameConfig): void` in `src/game/renderer.ts` with draw order: clear canvas, background, pipes, ground bar, bird, HUD score, start overlay (START phase), game-over overlay (GAME_OVER phase)
  - [~] 6.2 Ensure render skips all drawing operations if the canvas clear operation fails (per Req 7.3 error handling)

- [ ] 7. Implement the input handler
  - [~] 7.1 Implement `handleInput(stateRef: React.MutableRefObject<GameState>, config: GameConfig): void` in `src/game/input.ts` — transitions START → PLAYING, applies flap in PLAYING, transitions GAME_OVER → PLAYING (restart); ignores input in all other cases

- [ ] 8. Build the GameCanvas React component
  - [~] 8.1 Create `src/components/GameCanvas.tsx` with a canvas element sized 400×600 and CSS scaling to fit smaller viewports while preserving aspect ratio (Req 7.4)
  - [~] 8.2 Use `useRef` for the canvas element and all mutable game state (GameState, animation frame ID)
  - [~] 8.3 Implement `useEffect` that obtains the 2D context (renders fallback if unavailable), attaches `keydown`, `mousedown`, and `touchstart` event listeners, starts the rAF game loop, and returns a cleanup function that cancels rAF and removes all listeners
  - [~] 8.4 Implement the game loop tick: calculate delta time, run physics/pipes/scoring/collision when PLAYING, call render every frame, schedule next frame with rAF

- [ ] 9. Wire up the Next.js page
  - [~] 9.1 Create or update the root page (`app/page.tsx` or `pages/index.tsx`) to render `<GameCanvas />` centered on the page
  - [~] 9.2 Ensure the page is a static page with no server-side data fetching

- [ ] 10. Write property-based tests
  - [~] 10.1 Write property test for Property 1 (Reset produces clean initial state): for any score and pipe array, `resetGame` returns score === 0 and pipes === [] — Tag: `// Feature: flappy-bird-game, Property 1: Reset produces clean initial state`
  - [~] 10.2 Write property test for Property 2 (Gravity increases downward velocity): for any bird vy and positive dt, `applyPhysics(bird, dt).vy > bird.vy` — Tag: `// Feature: flappy-bird-game, Property 2: Gravity increases downward velocity`
  - [~] 10.3 Write property test for Property 3 (Flap applies upward velocity impulse): for any bird vy, `applyFlap(bird).vy === config.flapVelocity` — Tag: `// Feature: flappy-bird-game, Property 3: Flap applies upward velocity impulse`
  - [~] 10.4 Write property test for Property 4 (Top boundary clamps bird position): for any bird with y ≤ 0 and negative vy, after `applyPhysics` bird.y >= 0 — Tag: `// Feature: flappy-bird-game, Property 4: Top boundary clamps bird position`
  - [~] 10.5 Write property test for Property 5 (Spawned pipe gap is within valid bounds): for any call to `spawnPipe`, minGapY ≤ gapY ≤ maxGapY and gap height equals config.gapHeight — Tag: `// Feature: flappy-bird-game, Property 5: Spawned pipe gap is within valid bounds with constant height`
  - [~] 10.6 Write property test for Property 6 (Pipe update moves pipes left and removes off-screen pipes): for any pipe list and positive dt, remaining pipes have x decreased by birdSpeed * dt and no pipe with x + pipeWidth ≤ 0 remains — Tag: `// Feature: flappy-bird-game, Property 6: Pipe update moves pipes left and removes off-screen pipes`
  - [~] 10.7 Write property test for Property 7 (Collision detection correctly identifies overlapping bounding boxes): for generated overlapping and non-overlapping bird/pipe configurations, `checkCollision` returns the correct boolean — Tag: `// Feature: flappy-bird-game, Property 7: Collision detection correctly identifies overlapping bounding boxes`
  - [~] 10.8 Write property test for Property 8 (Score increments exactly once per pipe passage): for any score and bird/pipe position where bird has just passed an unscored pipe, `updateScore` returns score + 1 and marks pipe.passed = true — Tag: `// Feature: flappy-bird-game, Property 8: Score increments exactly once per pipe passage`
  - [~] 10.9 Write property test for Property 9 (Render always displays the current score): for any score value and phase in {PLAYING, GAME_OVER}, `render` calls `ctx.fillText` with a string containing the score — Tag: `// Feature: flappy-bird-game, Property 9: Render always displays the current score`
  - [~] 10.10 Write property test for Property 10 (Render draws all active game elements each frame): for any PLAYING state with any pipe array, `render` invokes drawing operations for bird, all pipes, and HUD — Tag: `// Feature: flappy-bird-game, Property 10: Render draws all active game elements each frame`

- [ ] 11. Write example-based unit tests
  - [~] 11.1 Test bird initialization: bird.x === canvasWidth * 0.25, bird.y === canvasHeight / 2 after `createInitialState` (Req 1.3)
  - [~] 11.2 Test canvas dimensions: canvas element has width 400 and height 600 (Req 7.2)
  - [~] 11.3 Test START → PLAYING transition: simulating Space keydown in START phase transitions to PLAYING (Req 1.2)
  - [~] 11.4 Test PLAYING → GAME_OVER transition: collision detection returning true stops the game loop and sets phase to GAME_OVER (Req 4.3)
  - [~] 11.5 Test GAME_OVER → PLAYING transition: simulating Space keydown in GAME_OVER phase resets and transitions to PLAYING (Req 6.4)
  - [~] 11.6 Test start screen rendering: render in START phase draws instruction text (Req 1.1)
  - [~] 11.7 Test game-over screen rendering: render in GAME_OVER phase draws overlay and restart option text (Req 6.1, 6.3)
  - [~] 11.8 Test bottom boundary: bird with y >= canvasHeight causes `checkCollision` to return true (Req 2.4, 4.2)
  - [~] 11.9 Test pipe spawn interval: after distanceTraveled crosses pipeInterval, a new pipe is added to the pipes array (Req 3.1)
  - [~] 11.10 Test flap ignored outside PLAYING: `handleInput` in START and GAME_OVER phases does not change bird.vy (Req 2.2)

- [ ] 12. Write integration tests
  - [~] 12.1 Test a single full game loop tick: verify bird position advances, pipes move, and score updates correctly in one frame
  - [~] 12.2 Test component mount/unmount: verify event listeners are attached on mount and removed on unmount with no memory leaks

## Notes

- All pure subsystem functions (`applyPhysics`, `applyFlap`, `updatePipes`, `spawnPipe`, `checkCollision`, `updateScore`, `render`) must be exported from their respective modules to enable unit and property testing in isolation.
- Property-based tests (tasks 10.x) require `fast-check` and must be configured with a minimum of 100 iterations each.
- The `render` function tests (10.9, 10.10) require a mock `CanvasRenderingContext2D` — use `jest-canvas-mock` or a manual spy object.
- Tasks 10.x are property-based tests (PBT tasks).
