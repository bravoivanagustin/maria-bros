import { SCENES } from '../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload(): void {
    const { width, height } = this.scale;

    const loadingText = this.add
      .text(width / 2, height / 2, 'Cargando...', {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 80, height / 2 + 20, 160, 10);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xff69b4, 1);
      progressBar.fillRect(width / 2 - 79, height / 2 + 21, 158 * value, 8);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  create(): void {
    this.scene.start(SCENES.PRELOAD);
  }
}
