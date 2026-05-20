export interface GameConfig {
  canvasWidth: number;       // 400
  canvasHeight: number;      // 600
  gravity: number;           // pixels/s² (e.g. 1500)
  flapVelocity: number;      // pixels/s upward (e.g. -500)
  birdSpeed: number;         // pixels/s horizontal (e.g. 200)
  pipeWidth: number;         // pixels (e.g. 60)
  gapHeight: number;         // pixels (e.g. 150)
  pipeInterval: number;      // pixels traveled between spawns (e.g. 250)
  minGapY: number;           // minimum top of gap from canvas top (e.g. 60)
  maxGapY: number;           // maximum top of gap (canvasHeight - gapHeight - 60)
  targetFPS: number;         // 60
}

export interface Bird {
  x: number;        // fixed horizontal position (canvasWidth * 0.25)
  y: number;        // vertical center of bird
  vy: number;       // vertical velocity (pixels/s)
  width: number;    // bounding box width (e.g. 34)
  height: number;   // bounding box height (e.g. 24)
}

export interface Pipe {
  x: number;        // left edge of pipe pair
  gapY: number;     // top of the gap (y coordinate)
  passed: boolean;  // true once the bird has passed this pipe (for scoring)
}

export type GamePhase = 'START' | 'PLAYING' | 'GAME_OVER';

export interface GameState {
  phase: GamePhase;
  bird: Bird;
  pipes: Pipe[];
  score: number;
  distanceTraveled: number;  // tracks pixels traveled for pipe spawn interval
  lastTimestamp: number;     // for delta-time calculation
}
