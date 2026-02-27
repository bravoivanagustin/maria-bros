import { GAME } from '../utils/constants';
import type { ScoreSystem } from '../systems/ScoreSystem';

const HUD_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '8px',
  color: '#ffffff',
  stroke: '#000000',
  strokeThickness: 2,
};

export class HUD {
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private nameText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private scoreSystem: ScoreSystem,
  ) {
    // Todos los textos son fijos a la cámara (setScrollFactor(0))
    this.nameText = scene.add
      .text(GAME.WIDTH / 2, 4, 'MARÍA', HUD_STYLE)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.scoreText = scene.add
      .text(4, 4, 'SCORE 000000', HUD_STYLE)
      .setScrollFactor(0)
      .setDepth(100);

    this.livesText = scene.add
      .text(GAME.WIDTH / 2, 12, '❤❤❤', HUD_STYLE)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.timeText = scene.add
      .text(GAME.WIDTH - 4, 4, 'TIME 200', HUD_STYLE)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100);

  }

  public update(): void {
    const score = this.scoreSystem.getScore();
    const lives = this.scoreSystem.getLives();
    const time = this.scoreSystem.getTime();

    this.scoreText.setText(`SCORE ${String(score).padStart(6, '0')}`);
    this.timeText.setText(`TIME ${time}`);

    const hearts = '❤'.repeat(Math.max(0, lives)) + '♡'.repeat(Math.max(0, GAME.MAX_LIVES - lives));
    this.livesText.setText(hearts);
  }

  public destroy(): void {
    this.scoreText.destroy();
    this.livesText.destroy();
    this.timeText.destroy();
    this.nameText.destroy();
  }
}
