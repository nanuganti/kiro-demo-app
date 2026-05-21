import { GameConfig } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 400,
  canvasHeight: 600,
  gravity: 1500,
  flapVelocity: -500,
  birdSpeed: 200,
  pipeWidth: 60,
  gapHeight: 150,
  pipeInterval: 250,
  minGapY: 60,
  maxGapY: 390,
  targetFPS: 60,
};
