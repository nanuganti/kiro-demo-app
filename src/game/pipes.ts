import { GameConfig, Pipe } from './types';

/**
 * Spawns a new pipe pair at the right edge of the canvas with a random gap position.
 * The gapY is clamped to [minGapY, maxGapY] to ensure the gap is always reachable.
 */
export function spawnPipe(config: GameConfig): Pipe {
  const { canvasWidth, minGapY, maxGapY } = config;

  const rawGapY = Math.random() * (maxGapY - minGapY) + minGapY;
  const gapY = Math.min(maxGapY, Math.max(minGapY, rawGapY));

  return {
    x: canvasWidth,
    gapY,
    passed: false,
  };
}

/**
 * Moves all pipes left by birdSpeed * dt and removes any that have scrolled
 * fully off the left edge of the canvas (x + pipeWidth <= 0).
 * Returns a new array (immutable pattern).
 */
export function updatePipes(pipes: Pipe[], dt: number, config: GameConfig): Pipe[] {
  const { birdSpeed, pipeWidth } = config;
  return pipes
    .map((pipe) => ({ ...pipe, x: pipe.x - birdSpeed * dt }))
    .filter((pipe) => pipe.x + pipeWidth > 0);
}
