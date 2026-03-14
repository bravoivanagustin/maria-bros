import { GAME, SCENES, FONTS } from '../utils/constants';
import { LevelRegistry } from '../config/LevelRegistry';

export class MenuScene extends Phaser.Scene {
  private selectedIndex: number = 0;
  private levelIds: string[] = [];
  private optionTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#5C94FC');
    this.selectedIndex = 0;
    this.optionTexts = [];
    this.levelIds = LevelRegistry.getAllIds();
    // Título
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 55, 'MARIA BROS', {
        fontFamily: FONTS.PIXEL,
        fontSize: '16px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Subtítulo
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 34, 'Rescata a Agustin', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Opciones de nivel
    this.levelIds.forEach((id, i) => {
      const level = LevelRegistry.getLevel(id);
      const y = GAME.HEIGHT / 2 - 4 + i * 22;

      const txt = this.add
        .text(GAME.WIDTH / 2, y, level.name, {
          fontFamily: FONTS.PIXEL,
          fontSize: '8px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      txt.on('pointerover', () => { this.selectedIndex = i; this.refreshCursor(); });
      txt.on('pointerdown', () => this.startLevel(this.levelIds[i]));

      this.optionTexts.push(txt);
    });

    // Atajos numéricos (1, 2, 3)
    this.levelIds.forEach((id, i) => {
      this.input.keyboard!.once(`keydown-${i + 1}`, () => this.startLevel(id));
    });

    // Navegación con flechas
    this.input.keyboard!.on('keydown-UP', () => {
      this.selectedIndex = (this.selectedIndex - 1 + this.levelIds.length) % this.levelIds.length;
      this.refreshCursor();
    });
    this.input.keyboard!.on('keydown-DOWN', () => {
      this.selectedIndex = (this.selectedIndex + 1) % this.levelIds.length;
      this.refreshCursor();
    });
    this.input.keyboard!.on('keydown-ENTER', () => this.startLevel(this.levelIds[this.selectedIndex]));
    this.input.keyboard!.on('keydown-SPACE', () => this.startLevel(this.levelIds[this.selectedIndex]));

    // Controles
    this.add
      .text(GAME.WIDTH / 2, GAME.HEIGHT - 28, 'Flechas: mover   Arriba: saltar', {
        fontFamily: FONTS.PIXEL,
        fontSize: '8px',
        color: '#cccccc',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    this.refreshCursor();
  }

  private refreshCursor(): void {
    this.optionTexts.forEach((txt, i) => {
      txt.setText(
        i === this.selectedIndex
          ? `> ${LevelRegistry.getLevel(this.levelIds[i]).name} <`
          : LevelRegistry.getLevel(this.levelIds[i]).name,
      );
      txt.setColor(i === this.selectedIndex ? '#ffdd00' : '#ffffff');
    });
  }

  private startLevel(levelId: string): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.GAME, { levelId, lives: GAME.MAX_LIVES });
    });
  }
}
