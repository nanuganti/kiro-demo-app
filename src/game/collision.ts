import { Bird, Pipe, GameConfig } from './types';

/**
 * AABB (axis-aligned bounding box) overlap test between two rectangles.
 * Each rectangle is defined by its left, right, top, and bottom edges.
 */
function aabbOverlap(
  aLeft: number, aRight: number, aTop: number, aBottom: number,
  bLeft: number, bRight: number, bTop: number, bBottom: number
): boolean {
  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

/**
 * Check whether the bird has collided with any pipe or the bottom boundary.
 *
 * Bird bounding box (centered at bird.x, bird.y):
 *   left   = bird.x - bird.width  / 2
 *   right  = bird.x + bird.width  / 2
 *   top    = bird.y - bird.height / 2
 *   bottom = bird.y + bird.height / 2
 *
 * Upper pipe segment: x ∈ [pipe.x, pipe.x + pipeWidth], y ∈ [0, pipe.gapY]
 * Lower pipe segment: x ∈ [pipe.x, pipe.x + pipeWidth], y ∈ [pipe.gapY + gapHeight, canvasHeight]
 *
 * Bottom boundary: bird bottom >= canvasHeight
 */
export function checkCollision(bird: Bird, pipes: Pipe[], config: GameConfig): boolean {
  const { canvasHeight, pipeWidth, gapHeight } = config;

  // Bird bounding box edges
  const birdLeft   = bird.x - bird.width  / 2;
  const birdRight  = bird.x + bird.width  / 2;
  const birdTop    = bird.y - bird.height / 2;
  const birdBottom = bird.y + bird.height / 2;

  // Bottom boundary collision
  if (birdBottom >= canvasHeight) {
    return true;
  }

  // Pipe collision
  for (const pipe of pipes) {
    const pipeLeft  = pipe.x;
    const pipeRight = pipe.x + pipeWidth;

    // Upper pipe segment: y from 0 to pipe.gapY
    if (aabbOverlap(birdLeft, birdRight, birdTop, birdBottom, pipeLeft, pipeRight, 0, pipe.gapY)) {
      return true;
    }

    // Lower pipe segment: y from pipe.gapY + gapHeight to canvasHeight
    if (aabbOverlap(birdLeft, birdRight, birdTop, birdBottom, pipeLeft, pipeRight, pipe.gapY + gapHeight, canvasHeight)) {
      return true;
    }
  }

  return false;
}
