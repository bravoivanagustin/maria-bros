// Clase base para entidades físicas.
// No define update() abstracto para permitir que cada subclase
// tenga la firma específica que necesita (e.g. María recibe InputSystem).
export class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: number,
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(2); // personajes y enemigos delante del tilemap y los bloques
  }
}
