import { BaseEnemy } from './BaseEnemy';
import { ASSETS, EVENTS, PHYSICS } from '../../utils/constants';
import type { Maria } from '../Maria';

/** Distribución exponencial del tiempo de espera entre saltos (ms). */
const MEAN_WAIT_MS = 2200;
const MIN_WAIT_MS = 600;
const MAX_WAIT_MS = 5000;

enum FishState { WAITING, JUMPING }

export class Fish extends BaseEnemy {
  private readonly maxY: number;     // posición de reposo y punto de aparición
  private readonly jumpVelocity: number;
  private fishState: FishState = FishState.WAITING;

  constructor(scene: Phaser.Scene, x: number, minY: number, maxY: number) {
    super(scene, x, maxY, ASSETS.ENEMY_FISH, 0);
    this.maxY = maxY;

    // Velocidad inicial para alcanzar exactamente minY desde maxY
    this.jumpVelocity = -Math.sqrt(2 * PHYSICS.GRAVITY * (maxY - minY));

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setVelocityY(0);
    body.setSize(12, 12);
    body.setOffset(2, 2);

    this.setVisible(false);
    this.scheduleNextJump();
  }

  protected onUpdate(_delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.fishState === FishState.WAITING) {
      body.allowGravity = false; // prevenir que el group lo reactive
      return;
    }

    // Aparecer al cruzar el borde del foso
    if (body.velocity.y < 0 && this.y <= this.maxY + 32) {
      this.setVisible(true);
    }

    // Rotar según dirección de movimiento
    this.setAngle(body.velocity.y < 0 ? -90 : 90);

    // Aterrizar al volver a la posición de reposo
    if (body.velocity.y > 0 && this.y >= this.maxY) {
      this.land();
    }
  }

  private startJump(): void {
    if (!this.isAlive || !this.active) return;
    this.fishState = FishState.JUMPING;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = true;
    body.setVelocityY(this.jumpVelocity);
  }

  private land(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.y = this.maxY;
    body.allowGravity = false;
    body.setVelocityY(0);
    this.setAngle(0);
    this.setVisible(false);
    this.fishState = FishState.WAITING;
    this.scheduleNextJump();
  }

  /** Distribución exponencial: E[T] = MEAN_WAIT_MS, con clamp a [MIN, MAX]. */
  private scheduleNextJump(): void {
    const raw = -MEAN_WAIT_MS * Math.log(1 - Math.random());
    const delay = Phaser.Math.Clamp(raw, MIN_WAIT_MS, MAX_WAIT_MS);
    this.scene.time.delayedCall(delay, () => {
      if (this.isAlive && this.active) this.startJump();
    });
  }

  public onPlayerContact(maria: Maria): void {
    if (this.fishState !== FishState.JUMPING) return;
    maria.takeDamage();
  }

  public onStomped(): void {
    if (!this.isAlive) return;
    this.isAlive = false;
    this.setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = true;
    body.setVelocityY(-150);
    this.scene.events.emit(EVENTS.ENEMY_DIED);
    this.scene.time.delayedCall(800, () => {
      if (this.active) this.destroy();
    });
  }

  public destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
