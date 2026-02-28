import { BaseEnemy } from './BaseEnemy';
import { ANIMS, ASSETS, EVENTS, PHYSICS } from '../../utils/constants';
import type { Maria } from '../Maria';

export class Goomba extends BaseEnemy {
  private direction: number = -1; // -1 = izquierda, 1 = derecha

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.ENEMY_GOOMBA, 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12);
    body.setOffset(2, 2);

    this.play(ANIMS.GOOMBA_WALK);
  }

  public get alive(): boolean {
    return this.isAlive;
  }

  protected onUpdate(_delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Invertir dirección al chocar con paredes
    if (body.blocked.left) {
      this.direction = 1;
    } else if (body.blocked.right) {
      this.direction = -1;
    }

    body.setVelocityX(this.direction * PHYSICS.ENEMY_SPEED);
    this.setFlipX(this.direction > 0);
  }

  public onPlayerContact(maria: Maria): void {
    maria.takeDamage();
  }

  public onStomped(): void {
    if (!this.isAlive) return;
    this.isAlive = false;

    const body = this.body as Phaser.Physics.Arcade.Body;
    // Deslizarse con el frame de muerto — el body sigue activo para que caiga con gravedad
    body.setVelocityX(this.direction * PHYSICS.ENEMY_SPEED * 0.5);

    this.play(ANIMS.GOOMBA_DEAD, true);
    this.scene.events.emit(EVENTS.ENEMY_DIED);
    // Sin destroy: se queda deslizando indefinidamente, sin interactuar con María
  }

  public destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
