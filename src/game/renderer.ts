import { GameConfig, GameState } from './types';

// Visual constants
const SKY_COLOR = '#70c5ce';
const PIPE_COLOR = '#5aad3f';
const PIPE_BORDER_COLOR = '#3d7a2b';
const GROUND_COLOR = '#c8a96e';
const GROUND_STRIPE_COLOR = '#a07850';
const BIRD_BODY_COLOR = '#f5c518';
const BIRD_WING_COLOR = '#e8a000';
const HUD_TEXT_COLOR = '#ffffff';
const HUD_TEXT_SHADOW = 'rgba(0,0,0,0.5)';
const OVERLAY_BG = 'rgba(0, 0, 0, 0.45)';
const OVERLAY_TEXT_COLOR = '#ffffff';
const OVERLAY_SCORE_COLOR = '#ffe066';

const GROUND_HEIGHT = 40;

/**
 * Renders a single frame of the Flappy Bird game onto the provided canvas context.
 *
 * Draw order:
 *  1. Clear canvas
 *  2. Background (sky)
 *  3. Pipes (upper and lower segments)
 *  4. Ground bar
 *  5. Bird
 *  6. HUD score
 *  7. Start overlay (phase === 'START')
 *  8. Game-over overlay (phase === 'GAME_OVER')
 *
 * Per Req 7.3: if the canvas clear operation fails, all drawing for that frame is skipped.
 *
 * @param ctx    The 2D rendering context to draw on
 * @param state  Current game state
 * @param config Game configuration (dimensions, pipe sizes, etc.)
 */
export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  config: GameConfig
): void {
  const { canvasWidth, canvasHeight, pipeWidth, gapHeight } = config;
  const { bird, pipes, score, phase } = state;

  // Step 1: Clear canvas — if this throws, skip all drawing for this frame (Req 7.3)
  try {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  } catch {
    return;
  }

  // Step 2: Background — sky fill
  ctx.fillStyle = SKY_COLOR;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Step 3: Pipes (upper and lower segments)
  for (const pipe of pipes) {
    const upperPipeHeight = pipe.gapY;
    const lowerPipeTop = pipe.gapY + gapHeight;
    const lowerPipeHeight = canvasHeight - lowerPipeTop;

    // Upper pipe segment
    ctx.fillStyle = PIPE_COLOR;
    ctx.fillRect(pipe.x, 0, pipeWidth, upperPipeHeight);
    // Upper pipe border/cap
    ctx.fillStyle = PIPE_BORDER_COLOR;
    ctx.fillRect(pipe.x - 3, upperPipeHeight - 16, pipeWidth + 6, 16);

    // Lower pipe segment
    ctx.fillStyle = PIPE_COLOR;
    ctx.fillRect(pipe.x, lowerPipeTop, pipeWidth, lowerPipeHeight);
    // Lower pipe border/cap
    ctx.fillStyle = PIPE_BORDER_COLOR;
    ctx.fillRect(pipe.x - 3, lowerPipeTop, pipeWidth + 6, 16);
  }

  // Step 4: Ground bar
  const groundY = canvasHeight - GROUND_HEIGHT;
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, groundY, canvasWidth, GROUND_HEIGHT);
  // Ground stripe for visual depth
  ctx.fillStyle = GROUND_STRIPE_COLOR;
  ctx.fillRect(0, groundY, canvasWidth, 6);

  // Step 5: Bird — yellow/orange rectangle with a wing accent
  const birdLeft = bird.x - bird.width / 2;
  const birdTop = bird.y - bird.height / 2;

  // Body
  ctx.fillStyle = BIRD_BODY_COLOR;
  ctx.beginPath();
  ctx.roundRect(birdLeft, birdTop, bird.width, bird.height, 6);
  ctx.fill();

  // Wing accent (darker orange stripe)
  ctx.fillStyle = BIRD_WING_COLOR;
  ctx.beginPath();
  ctx.roundRect(birdLeft + 4, birdTop + bird.height * 0.55, bird.width * 0.5, bird.height * 0.3, 3);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(birdLeft + bird.width * 0.72, birdTop + bird.height * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.arc(birdLeft + bird.width * 0.74, birdTop + bird.height * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Step 6: HUD score — score text at top center
  ctx.save();
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  // Shadow for readability
  ctx.fillStyle = HUD_TEXT_SHADOW;
  ctx.fillText(String(score), canvasWidth / 2 + 2, 18);
  ctx.fillStyle = HUD_TEXT_COLOR;
  ctx.fillText(String(score), canvasWidth / 2, 16);
  ctx.restore();

  // Step 7: Start overlay
  if (phase === 'START') {
    ctx.save();
    ctx.fillStyle = OVERLAY_BG;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.fillStyle = OVERLAY_TEXT_COLOR;
    ctx.fillText('Flappy Bird', canvasWidth / 2, canvasHeight / 2 - 60);

    // Instruction
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = OVERLAY_TEXT_COLOR;
    ctx.fillText('Press Space or Click to Start', canvasWidth / 2, canvasHeight / 2 + 10);

    ctx.restore();
    return;
  }

  // Step 8: Game-over overlay
  if (phase === 'GAME_OVER') {
    ctx.save();
    ctx.fillStyle = OVERLAY_BG;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "Game Over" heading
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.fillStyle = OVERLAY_TEXT_COLOR;
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 2 - 70);

    // Final score label
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = OVERLAY_TEXT_COLOR;
    ctx.fillText('Score', canvasWidth / 2, canvasHeight / 2 - 20);

    // Final score value
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillStyle = OVERLAY_SCORE_COLOR;
    ctx.fillText(String(score), canvasWidth / 2, canvasHeight / 2 + 30);

    // Restart instruction
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = OVERLAY_TEXT_COLOR;
    ctx.fillText('Press Space or Click to Restart', canvasWidth / 2, canvasHeight / 2 + 90);

    ctx.restore();
  }
}
