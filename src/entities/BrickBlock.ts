import { ASSETS } from '../utils/constants';

export class BrickBlock extends Phaser.Physics.Arcade.Sprite {
  private broken: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.BRICK_BLOCK);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setDepth(1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.allowGravity = false;
    body.setSize(14, 14);
    body.setOffset(1, 1);
  }

  public get isBreakable(): boolean {
    return !this.broken;
  }

  /** Llamado cuando María golpea el bloque desde abajo */
  public hit(): void {
    if (this.broken) return;
    this.broken = true;

    // Pequeño bump visual antes de romper
    this.scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: 50,
      ease: 'Quad.out',
      yoyo: true,
      onComplete: () => {
        this.breakApart();
        (this.body as Phaser.Physics.Arcade.Body).enable = false;
        this.setVisible(false);
        this.scene.time.delayedCall(450, () => { this.destroy(); });
      },
    });
  }

  private breakApart(): void {
    // 4 fragmentos que salen en distintas direcciones
    const pieces = [
      { ox: -4, oy: -4, tx: -22, ty: -26 },
      { ox:  4, oy: -4, tx:  22, ty: -26 },
      { ox: -4, oy:  4, tx: -22, ty:   8 },
      { ox:  4, oy:  4, tx:  22, ty:   8 },
    ];

    for (const p of pieces) {
      const px = this.x + p.ox;
      const py = this.y + p.oy;
      const piece = this.scene.add.image(px, py, ASSETS.BRICK_BLOCK);
      piece.setScale(0.45);
      piece.setDepth(3);

      this.scene.tweens.add({
        targets: piece,
        x: this.x + p.tx,
        y: this.y + p.ty,
        alpha: 0,
        duration: 380,
        ease: 'Quad.in',
        onComplete: () => piece.destroy(),
      });
    }
  }
}
