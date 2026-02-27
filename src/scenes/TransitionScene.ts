import { SCENES } from '../utils/constants';
import type { SceneTransitionData } from '../types';

export class TransitionScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.TRANSITION });
  }

  create(data: SceneTransitionData): void {
    const nextLevel = data.levelId ?? 'level1';

    this.cameras.main.setBackgroundColor('#000000');

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `Mundo ${nextLevel.replace('level', '')}`,
        {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '14px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        },
      )
      .setOrigin(0.5);

    this.cameras.main.fadeIn(300);

    this.time.delayedCall(1200, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start(SCENES.GAME, { levelId: nextLevel });
      });
    });
  }
}
