import { Bird, GameConfig, Pipe } from './types';

/**
 * Checks each pipe to see if the bird has passed it (bird.x > pipe.x + pipeWidth)
 * and the pipe has not yet been scored (pipe.passed === false).
 * For each such pipe, increments the score by 1 and marks the pipe as passed.
 *
 * Returns new pipe objects (immutable pattern) and the updated score.
 */
export function updateScore(
  score: number,
  bird: Bird,
  pipes: Pipe[],
  config: GameConfig
): { score: number; pipes: Pipe[] } {
  const { pipeWidth } = config;
  let updatedScore = score;

  const updatedPipes = pipes.map((pipe) => {
    if (bird.x > pipe.x + pipeWidth && pipe.passed === false) {
      updatedScore += 1;
      return { ...pipe, passed: true };
    }
    return pipe;
  });

  return { score: updatedScore, pipes: updatedPipes };
}
