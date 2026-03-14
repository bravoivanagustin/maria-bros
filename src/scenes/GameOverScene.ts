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

    const menuBtn = this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 30, '[ Menu principal ]', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    const menuZone = this.add
      .zone(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 30, 180, 20)
      .setInteractive({ useHandCursor: true });

    menuZone.on('pointerover', () => menuBtn.setColor('#ff6666'));
    menuZone.on('pointerout',  () => menuBtn.setColor('#ffffff'));
    menuZone.on('pointerdown', () => { this.goToMenu(); });

    this.input.keyboard!.once('keydown-SPACE', () => { this.goToMenu(); });
    this.input.keyboard!.once('keydown-ENTER', () => { this.goToMenu(); });
    this.input.keyboard!.once('keydown-ESC',   () => { this.goToMenu(); });

    this.cameras.main.fadeIn(500);
  }

  private goToMenu(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
