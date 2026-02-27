import { ANIMS, ASSETS } from '../utils/constants';

export class Agustin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.PRINCESS, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.allowGravity = false;
    body.setSize(14, 16);

    this.play(ANIMS.AGUSTIN_IDLE);
  }

  public update(_delta: number): void {
    // Agustín espera quieto — no hace nada por ahora
  }
}
