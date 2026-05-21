import { Bird, GameConfig, GameState } from './types';
import { createInitialState } from './initialState';

/**
 * Applies gravity and velocity to the bird for one time step.
 *
 * - Increases vertical velocity by gravity * dt (accelerates downward)
 * - Updates y position by vy * dt
 * - Clamps y to [0, canvasHeight]
 * - If the bird reaches the top boundary (y <= 0), zeroes out vy
 *
 * @param bird   Current bird state
 * @param dt     Delta time in seconds
 * @param config Game configuration (gravity, canvasHeight)
 * @returns      New bird state after physics update
 */
export function applyPhysics(bird: Bird, dt: number, config: GameConfig): Bird {
  let vy = bird.vy + config.gravity * dt;
  let y = bird.y + vy * dt;

  // Clamp to canvas bounds and handle boundary conditions
  if (y <= 0) {
    y = 0;
    vy = 0;
  } else if (y > config.canvasHeight) {
    y = config.canvasHeight;
  }

  return { ...bird, y, vy };
}

/**
 * Applies an upward flap impulse to the bird.
 *
 * - Sets vy to config.flapVelocity (negative value = upward)
 * - Overrides any prior vertical velocity
 *
 * @param bird   Current bird state
 * @param config Game configuration (flapVelocity)
 * @returns      New bird state with updated vy
 */
export function applyFlap(bird: Bird, config: GameConfig): Bird {
  return { ...bird, vy: config.flapVelocity };
}

/**
 * Resets the game to a fresh initial state, transitioning to the PLAYING phase.
 *
 * - Delegates to createInitialState for a clean slate (score = 0, pipes = [])
 * - Overrides phase to 'PLAYING' since reset is triggered from GAME_OVER
 *
 * @param state  Current game state (unused, present for symmetry with other updaters)
 * @param config Game configuration used to initialize bird position and dimensions
 * @returns      Fresh GameState with phase set to 'PLAYING'
 */
export function resetGame(state: GameState, config: GameConfig): GameState {
  return {
    ...createInitialState(config),
    phase: 'PLAYING',
  };
}
