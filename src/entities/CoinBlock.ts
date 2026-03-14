import { ANIMS, ASSETS, EVENTS } from '../utils/constants';

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

    this.setDepth(1); // detrás de personajes (depth 2), delante del tilemap (depth 0)

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.allowGravity = false;

    this.play(ANIMS.COIN_BLOCK_SPIN);
  }

  public get isActive(): boolean {
    return this.blockState === CoinBlockState.ACTIVE;
  }

  /** Llamado cuando María golpea el bloque desde abajo */
  public hit(): void {
    if (this.blockState === CoinBlockState.USED) return;
    this.blockState = CoinBlockState.USED;

    this.stop();
    this.setFrame(3); // frame "usado" (0-2 = activos, 3 = usado)
    this.animateBump();
    this.spawnCoinPopup();
    this.scene.events.emit(EVENTS.COIN_COLLECTED);
  }

  private animateBump(): void {
    const originalY = this.y;

    // Usar imagen visual separada para la animación del bump.
    // El sprite físico (con su body) permanece quieto — así María no es empujada.
    // Phaser sincroniza sprite.y → body.y en preUpdate cada frame; si moviemos
    // el sprite directamente, el body la sigue y puede causar glitch de colisión.
    const visual = this.scene.add.image(this.x, originalY, ASSETS.COIN_BLOCK, 3);
    visual.setDepth(this.depth + 0.1);
    this.setVisible(false); // ocultamos el sprite físico durante la animación

    this.scene.tweens.add({
      targets: visual,
      y: originalY - 6,
      duration: 80,
      ease: 'Quad.out',
      yoyo: true,
      onComplete: () => {
        visual.destroy();
        this.setVisible(true);
      },
    });
  }

  private spawnCoinPopup(): void {
    const coin = this.scene.add.image(this.x, this.y - 8, ASSETS.COIN, 0);
    coin.setDepth(3);

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
