import { GameConfig, GameState } from './types';

/**
 * Creates a fresh initial game state from the provided config.
 * Bird is positioned at x = canvasWidth * 0.25, y = canvasHeight / 2.
 */
export function createInitialState(config: GameConfig): GameState {
  return {
    phase: 'START',
    bird: {
      x: config.canvasWidth * 0.25,
      y: config.canvasHeight / 2,
      vy: 0,
      width: 34,
      height: 24,
    },
    pipes: [],
    score: 0,
    distanceTraveled: 0,
    lastTimestamp: 0,
  };
}
