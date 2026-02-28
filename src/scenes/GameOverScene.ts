import { GAME, SCENES, FONTS } from '../utils/constants';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#220000');

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 30, 'GAME OVER', {
        fontFamily: FONTS.PIXEL,
        fontSize: '16px',
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2, 'No te rindas!', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffaaaa',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    const retryBtn = this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 30, '[ Intentar de nuevo ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retryBtn.on('pointerover', () => retryBtn.setColor('#ff6666'));
    retryBtn.on('pointerout', () => retryBtn.setColor('#ffffff'));
    retryBtn.on('pointerdown', () => this.retry());

    const menuBtn = this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 52, '[ Menu principal ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#aaaaaa',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setColor('#ffffff'));
    menuBtn.on('pointerout', () => menuBtn.setColor('#aaaaaa'));
    menuBtn.on('pointerdown', () => this.goToMenu());

    this.input.keyboard!.once('keydown-SPACE', () => this.retry());
    this.input.keyboard!.once('keydown-ENTER', () => this.retry());
    this.input.keyboard!.once('keydown-ESC',   () => this.goToMenu());

    this.cameras.main.fadeIn(500);
  }

  private retry(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.GAME, { levelId: 'level1' });
    });
  }

  private goToMenu(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
