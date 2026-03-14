import { GAME, SCENES, FONTS } from '../utils/constants';
import { LevelRegistry } from '../config/LevelRegistry';
import type { SceneTransitionData } from '../types';

export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.WIN });
  }

  init(_data: SceneTransitionData): void {
    // Podría mostrarse el score final en el futuro
  }

  create(data: SceneTransitionData): void {
    this.cameras.main.setBackgroundColor('#000022');

    const score = data.score ?? 0;
    const levelId = data.levelId ?? 'level1';
    const nextLevelId = LevelRegistry.getNextLevelId(levelId);

    if (nextLevelId !== null) {
      this.createIntermediateScreen(score, nextLevelId);
      this.cameras.main.fadeIn(600);
    } else {
      this.scene.start(SCENES.ENDING, { score });
    }
  }

  private createIntermediateScreen(score: number, nextLevelId: string): void {
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 40, 'NIVEL COMPLETADO!', {
        fontFamily: FONTS.PIXEL,
        fontSize: '12px',
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 10, `SCORE: ${String(score).padStart(6, '0')}`, {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#aaffaa',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 30, '[ Siguiente nivel ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffdd00'));
    btn.on('pointerout', () => btn.setColor('#ffffff'));
    btn.on('pointerdown', () => this.goToLevel(nextLevelId, score));

    this.input.keyboard!.once('keydown-SPACE', () => this.goToLevel(nextLevelId, score));
    this.input.keyboard!.once('keydown-ENTER', () => this.goToLevel(nextLevelId, score));
  }

  private goToLevel(levelId: string, score: number): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.GAME, { levelId, score });
    });
  }

}
