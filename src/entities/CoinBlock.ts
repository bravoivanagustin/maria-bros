import { ASSETS, EVENTS } from '../utils/constants';

enum CoinBlockState {
  ACTIVE = 'ACTIVE',
  USED   = 'USED',
}

export class CoinBlock extends Phaser.Physics.Arcade.Sprite {
  private blockState: CoinBlockState = CoinBlockState.ACTIVE;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.COIN_BLOCK, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, false); // cuerpo dinámico

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.allowGravity = false;
    body.setSize(14, 14);
    body.setOffset(1, 1);
  }

  public get isActive(): boolean {
    return this.blockState === CoinBlockState.ACTIVE;
  }

  /** Llamado cuando María golpea el bloque desde abajo */
  public hit(): void {
    if (this.blockState === CoinBlockState.USED) return;
    this.blockState = CoinBlockState.USED;

    this.setFrame(1); // frame "usado"
    this.animateBump();
    this.spawnCoinPopup();
    this.scene.events.emit(EVENTS.COIN_COLLECTED);
  }

  private animateBump(): void {
    const originalY = this.y;
    const body = this.body as Phaser.Physics.Arcade.Body;

    this.scene.tweens.add({
      targets: this,
      y: originalY - 6,
      duration: 80,
      ease: 'Quad.out',
      yoyo: true,
      onUpdate: () => {
        // Sincronizar el cuerpo físico con la posición del sprite
        body.reset(this.x, this.y);
      },
      onComplete: () => {
        this.y = originalY;
        body.reset(this.x, originalY);
      },
    });
  }

  private spawnCoinPopup(): void {
    const coin = this.scene.add.rectangle(this.x, this.y - 8, 8, 8, 0xffdd00);

    this.scene.tweens.add({
      targets: coin,
      y: this.y - 28,
      alpha: 0,
      duration: 600,
      ease: 'Cubic.out',
      onComplete: () => coin.destroy(),
    });
  }
}
