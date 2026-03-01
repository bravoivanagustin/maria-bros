import { ASSETS, EVENTS, FLAG, FONTS } from '../utils/constants';

export class FlagPole {
  private readonly scene: Phaser.Scene;
  private readonly flagRect: Phaser.GameObjects.Rectangle;
  private readonly hitZone: Phaser.Physics.Arcade.Image;
  private touched: boolean = false;

  readonly poleX: number;
  readonly poleTopY: number;
  readonly poleBottomY: number;

  constructor(scene: Phaser.Scene, x: number, groundY: number) {
    this.scene = scene;
    this.poleX = x;
    this.poleBottomY = groundY;
    this.poleTopY = groundY - FLAG.POLE_HEIGHT;

    // Bandera (arranca en la cima del mástil, encima del tile del poste)
    this.flagRect = scene.add.rectangle(
      x + FLAG.POLE_WIDTH / 2 + FLAG.FLAG_WIDTH / 2 + 1,
      this.poleTopY + 4 + FLAG.FLAG_HEIGHT / 2,
      FLAG.FLAG_WIDTH,
      FLAG.FLAG_HEIGHT,
      0xff4444,
    );

    // Zona de colisión invisible que cubre todo el mástil
    const physics = scene.physics as unknown as Phaser.Physics.Arcade.ArcadePhysics;
    this.hitZone = physics.add.image(
      x,
      this.poleTopY + FLAG.POLE_HEIGHT / 2,
      ASSETS.FLAG_ZONE,
    );
    this.hitZone.setAlpha(0);
    const body = this.hitZone.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setImmovable(true);
    body.setSize(FLAG.POLE_WIDTH + 8, FLAG.POLE_HEIGHT);
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
    const relativeY = Phaser.Math.Clamp(mariaY - this.poleTopY, 0, FLAG.POLE_HEIGHT);
    const pct = relativeY / FLAG.POLE_HEIGHT;

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
    const targetY = this.poleBottomY - 4 - FLAG.FLAG_HEIGHT / 2;

    this.scene.tweens.add({
      targets: this.flagRect,
      y: targetY,
      duration: 1200,
      ease: 'Cubic.in',
      onComplete: () => {
        this.scene.time.delayedCall(500, () => {
          this.scene.events.emit(EVENTS.LEVEL_WIN);
        });
      },
    });
  }
}
