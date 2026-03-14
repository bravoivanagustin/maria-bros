import { ASSETS, EVENTS, FLAG, FONTS } from '../utils/constants';

export class FlagPole {
  private readonly scene: Phaser.Scene;
  private readonly flagImage: Phaser.GameObjects.Image;
  private readonly hitZone: Phaser.Physics.Arcade.Image;
  private readonly poleHeight: number;
  private readonly flagBottomY: number;
  private readonly winDelay: number;
  private touched: boolean = false;

  readonly poleX: number;
  readonly poleTopY: number;
  readonly poleBottomY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    groundY: number,
    poleHeight: number = FLAG.POLE_HEIGHT,
    flagBottomY: number = groundY,
    winDelay: number = 500,
  ) {
    this.scene = scene;
    this.poleX = x;
    this.poleBottomY = groundY;
    this.poleHeight = poleHeight;
    this.flagBottomY = flagBottomY;
    this.winDelay = winDelay;
    this.poleTopY = groundY - poleHeight;

    // Bandera (arranca en la cima del mástil, la imagen PNG de 16×16 cuelga a la derecha del poste)
    this.flagImage = scene.add.image(
      x + FLAG.POLE_WIDTH / 2,        // borde izquierdo de la bandera = borde derecho del poste
      this.poleTopY,                   // borde superior = cima del mástil
      ASSETS.FLAG_IMAGE,
    );
    this.flagImage.setOrigin(0, 0);   // anclar desde esquina superior-izquierda

    // Zona de colisión invisible que cubre todo el mástil
    const physics = scene.physics as unknown as Phaser.Physics.Arcade.ArcadePhysics;
    this.hitZone = physics.add.image(
      x,
      this.poleTopY + poleHeight / 2,
      ASSETS.FLAG_ZONE,
    );
    this.hitZone.setAlpha(0);
    const body = this.hitZone.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setImmovable(true);
    body.setSize(4, poleHeight);
  }

  public getHitZone(): Phaser.Physics.Arcade.Image {
    return this.hitZone;
  }

  /**
   * Llamado cuando María toca el mástil.
   * mariaY: posición Y del centro de María en el momento del contacto.
   */
  public touch(mariaY: number): void {
    if (this.touched) return;
    this.touched = true;

    // Desactivar hitZone para evitar cualquier interacción física posterior
    (this.hitZone.body as Phaser.Physics.Arcade.Body).enable = false;

    const bonus = this.calculateBonus(mariaY);
    this.scene.events.emit(EVENTS.FLAG_BONUS, bonus);
    this.showBonusText(bonus);
    this.animateFlagDown();
  }

  /**
   * Cuanto más arriba en el mástil, más puntos.
   * Divide el mástil en 5 zonas de igual altura.
   */
  private calculateBonus(mariaY: number): number {
    const relativeY = Phaser.Math.Clamp(mariaY - this.poleTopY, 0, this.poleHeight);
    const pct = relativeY / this.poleHeight;

    if (pct <= 0.2) return FLAG.BONUS_TOP;
    if (pct <= 0.4) return FLAG.BONUS_HIGH;
    if (pct <= 0.6) return FLAG.BONUS_MID;
    if (pct <= 0.8) return FLAG.BONUS_LOW;
    return FLAG.BONUS_BOTTOM;
  }

  /** Texto flotante con el bonus ganado */
  private showBonusText(bonus: number): void {
    const text = this.scene.add.text(this.poleX, this.poleTopY - 8, `+${bonus}`, {
      fontFamily: FONTS.PIXEL,
      fontSize: '6px',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 2,
    });
    text.setOrigin(0.5, 1);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 28,
      alpha: 0,
      duration: 1600,
      ease: 'Cubic.out',
      onComplete: () => text.destroy(),
    });
  }

  /** La bandera baja por el mástil; al terminar, emite LEVEL_WIN */
  private animateFlagDown(): void {
    // targetY = posición final con el borde superior de la imagen justo encima del suelo
    const targetY = this.flagBottomY - 16 - 4;

    this.scene.tweens.add({
      targets: this.flagImage,
      y: targetY,
      duration: 1200,
      ease: 'Cubic.in',
      onComplete: () => {
        this.scene.time.delayedCall(this.winDelay, () => {
          this.scene.events.emit(EVENTS.LEVEL_WIN);
        });
      },
    });
  }
}
