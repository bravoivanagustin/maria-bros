import { GAME, SCENES, FONTS } from '../utils/constants';
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

    // Mensaje principal
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 50, 'LO LOGRASTE!', {
        fontFamily: FONTS.PIXEL,
        fontSize: '16px',
        color: '#ff69b4',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 30, 'Rescataste a Agustin!', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 10, 'Te amo, Maria', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 10, `SCORE FINAL: ${String(score).padStart(6, '0')}`, {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#aaffaa',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Botón volver al menú
    const menuBtn = this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 40, '[ Volver al menú ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setColor('#ff69b4'));
    menuBtn.on('pointerout', () => menuBtn.setColor('#ffffff'));
    menuBtn.on('pointerdown', () => this.goToMenu());

    this.input.keyboard!.once('keydown-SPACE', () => this.goToMenu());
    this.input.keyboard!.once('keydown-ENTER', () => this.goToMenu());

    this.cameras.main.fadeIn(600);
  }

  private goToMenu(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
