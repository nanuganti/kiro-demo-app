# Requirements Document

## Introduction

This document defines the requirements for a Flappy Bird game built as a Next.js web application. The game features a bird that moves forward automatically while gravity pulls it downward. The player taps or clicks to make the bird flap and navigate through gaps between pipe obstacles of varying heights. The player's score is tracked and displayed during gameplay, and a game-over screen shows the final score when the bird collides with a pipe or the ground.

## Glossary

- **Bird**: The player-controlled character that moves horizontally at a constant speed and is subject to gravity.
- **Pipe**: A vertical obstacle consisting of an upper and lower segment with a gap in between through which the Bird must pass.
- **Gap**: The open space between the upper and lower segments of a Pipe through which the Bird must fly.
- **Score**: The count of Pipe pairs the Bird has successfully passed through during a single game session.
- **Game**: The Next.js web application implementing the Flappy Bird experience.
- **Game_Loop**: The continuous update cycle that drives physics, collision detection, and rendering.
- **Canvas**: The HTML rendering surface on which the Game is drawn.
- **Gravity**: The constant downward acceleration applied to the Bird each Game_Loop tick.
- **Flap**: An upward velocity impulse applied to the Bird in response to player input.
- **Game_Over_Screen**: The UI overlay displayed when the game session ends, showing the final Score.
- **HUD**: The heads-up display showing the current Score during active gameplay.

---

## Requirements

### Requirement 1: Game Initialization

**User Story:** As a player, I want to start a new game session, so that I can begin playing Flappy Bird.

#### Acceptance Criteria

1. WHEN the Game page loads, THE Game SHALL display a start screen with instructions to begin play.
2. WHEN the player presses the Space key or clicks the Canvas on the start screen, THE Game SHALL transition to the active gameplay state and begin the Game_Loop.
3. WHEN a new game session begins, THE Game SHALL initialize the Bird at a fixed horizontal position and vertically centered on the Canvas.
4. WHEN a new game session begins, THE Game SHALL reset the Score to zero.
5. WHEN a new game session begins, THE Game SHALL clear all existing Pipes from the Canvas.

---

### Requirement 2: Bird Physics

**User Story:** As a player, I want the bird to respond to gravity and my input, so that I can control its vertical position.

#### Acceptance Criteria

1. WHILE the Game_Loop is active, THE Game SHALL apply a constant downward Gravity acceleration to the Bird on every tick.
2. WHEN the player presses the Space key or clicks the Canvas during active gameplay, THE Game SHALL apply an upward Flap velocity impulse to the Bird, and SHALL ignore flap inputs received outside of the active gameplay state.
3. WHILE the Game_Loop is active, THE Bird SHALL move horizontally at a constant speed without player input.
4. WHEN the Bird's vertical position reaches the bottom boundary of the Canvas, THE Game SHALL transition to the game-over state.
5. WHEN the Bird's vertical position reaches the top boundary of the Canvas, THE Game SHALL prevent the Bird from moving above the top boundary.

---

### Requirement 3: Pipe Generation and Movement

**User Story:** As a player, I want pipes to appear at varying heights, so that the game presents a continuous challenge.

#### Acceptance Criteria

1. WHILE the Game_Loop is active, THE Game SHALL spawn a new Pipe pair at a fixed horizontal interval measured in pixels traveled.
2. WHEN a Pipe pair is spawned, THE Game SHALL assign the Gap a random vertical position within a range that ensures at least a portion of both pipe segments is visible on the Canvas, including positions at the canvas edges.
3. WHEN a Pipe pair is spawned, THE Game SHALL assign the Gap a fixed height that remains constant throughout the game session.
4. WHILE the Game_Loop is active, THE Game SHALL move all active Pipes horizontally toward the left edge of the Canvas at exactly the same constant speed as the Bird's forward movement.
5. WHEN a Pipe pair moves entirely off the left edge of the Canvas, THE Game SHALL remove that Pipe pair from the active set.

---

### Requirement 4: Collision Detection

**User Story:** As a player, I want the game to detect when my bird hits a pipe or the ground, so that the game ends correctly.

#### Acceptance Criteria

1. WHEN the Bird's bounding box overlaps with the bounding box of any Pipe segment, THE Game SHALL transition to the game-over state.
2. WHEN the Bird's vertical position reaches the bottom boundary of the Canvas, THE Game SHALL transition to the game-over state.
3. WHEN the Game transitions to the game-over state, THE Game SHALL immediately stop the Game_Loop, halting all updates within the same frame the collision is detected.

---

### Requirement 5: Scoring

**User Story:** As a player, I want my score to increase as I pass through pipes, so that I can track my progress.

#### Acceptance Criteria

1. WHEN the Bird's horizontal position passes the right edge of a Pipe pair's Gap, THE Game SHALL increment the Score by one.
2. WHILE the Game_Loop is active, THE HUD SHALL display the current Score at the top of the Canvas.
3. THE HUD SHALL update the displayed Score immediately after each Score increment event.

---

### Requirement 6: Game Over

**User Story:** As a player, I want to see my score when the game ends, so that I know how well I performed.

#### Acceptance Criteria

1. WHEN the Game transitions to the game-over state, THE Game SHALL display the Game_Over_Screen overlaid on the Canvas.
2. WHEN the Game_Over_Screen is displayed, THE Game SHALL show the final Score achieved in the ended session.
3. WHEN the Game_Over_Screen is displayed, THE Game SHALL provide a visible option for the player to restart the game.
4. WHEN the player presses the Space key or clicks the restart option on the Game_Over_Screen, THE Game SHALL transition back to the active gameplay state and begin a new game session.

---

### Requirement 7: Rendering and Display

**User Story:** As a player, I want smooth and visually clear gameplay, so that I can enjoy the game experience.

#### Acceptance Criteria

1. THE Game SHALL render at a target frame rate of 60 frames per second using the browser's requestAnimationFrame API.
2. THE Canvas SHALL maintain a fixed width of 400 pixels and a fixed height of 600 pixels.
3. WHEN the Game renders each frame and the Canvas clear operation succeeds, THE Game SHALL redraw all active game elements including the Bird, all active Pipes, and the HUD. IF the Canvas clear operation fails, THEN THE Game SHALL skip drawing for that frame entirely.
4. WHERE the browser viewport is smaller than the Canvas dimensions, THE Game SHALL scale the Canvas to fit within the viewport while preserving the aspect ratio.
