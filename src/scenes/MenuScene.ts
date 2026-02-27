import { GAME, SCENES } from '../utils/constants';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#5C94FC');

    // Título
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 40, 'MARÍA BROS', {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Subtítulo romántico
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 20, 'Rescata a Agustin', {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '10px',
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instrucciones
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 10, 'ESPACIO para jugar', {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '10px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 24, 'Flechas: mover   Arriba: saltar', {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '8px',
        color: '#cccccc',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Parpadeo del texto "ESPACIO"
    const blinkText = this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT - 20, 'Presiona ESPACIO', {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '9px',
        color: '#ff69b4',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: blinkText,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Transición directa para evitar problemas con camera fade doble
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start(SCENES.GAME, { levelId: 'level1' });
    });
  }
}
