import { ANIMS, ASSETS, EVENTS } from '../../utils/constants';

export class Coin extends Phaser.Physics.Arcade.Sprite {
  private collected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.COIN, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // true = static body
    this.setDepth(2);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(10, 10);
    body.setOffset(3, 3);

    this.play(ANIMS.COIN_SPIN);
  }

  public collect(): void {
    if (this.collected) return;
    this.collected = true;

    this.scene.events.emit(EVENTS.COIN_COLLECTED);
    this.destroy();
  }
}
