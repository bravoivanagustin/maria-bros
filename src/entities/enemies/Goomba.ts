import { BaseEnemy } from './BaseEnemy';
import { ANIMS, ASSETS, EVENTS, PHYSICS } from '../../utils/constants';
import type { Maria } from '../Maria';

export class Goomba extends BaseEnemy {
  private direction: number = -1; // -1 = izquierda, 1 = derecha
  private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.ENEMY_GOOMBA, 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12);
    body.setOffset(2, 4);

    this.play(ANIMS.GOOMBA_WALK);
  }

  public get alive(): boolean {
    return this.isAlive;
  }

  public setGroundLayer(layer: Phaser.Tilemaps.TilemapLayer): void {
    this.groundLayer = layer;
  }

  // Override: maneja estado vivo Y muerto (BaseEnemy.update solo corre onUpdate cuando vivo)
  public update(delta: number): void {
    if (this.isAlive) {
      this.onUpdate(delta);
    } else {
      this.updateDead();
    }
  }

  protected onUpdate(_delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Paredes primero; luego borde de plataforma (solo cuando está en el suelo)
    if (body.blocked.left) {
      this.direction = 1;
    } else if (body.blocked.right) {
      this.direction = -1;
    } else if (body.blocked.down && !this.hasGroundAhead()) {
      this.direction = -this.direction;
    }

    body.setVelocityX(this.direction * PHYSICS.ENEMY_SPEED);
    this.setFlipX(this.direction > 0);
  }

  // Lógica de movimiento para el estado muerto (aplastado pero sigue moviéndose)
  private updateDead(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.left) {
      this.direction = 1;
    } else if (body.blocked.right) {
      this.direction = -1;
    } else if (body.blocked.down && !this.hasGroundAhead()) {
      this.direction = -this.direction;
    }

    body.setVelocityX(this.direction * PHYSICS.ENEMY_SPEED * 0.5);
    this.setFlipX(this.direction > 0);
  }

  // Devuelve false cuando no hay tile de suelo justo adelante (detección de foso)
  private hasGroundAhead(): boolean {
    if (!this.groundLayer) return true; // sin capa registrada, asumir suelo seguro
    const body = this.body as Phaser.Physics.Arcade.Body;
    const checkX = this.direction > 0 ? body.right + 4 : body.left - 4;
    const checkY = body.bottom + 8;
    const tile = this.groundLayer.getTileAtWorldXY(checkX, checkY);
    return tile !== null && tile.index !== -1;
  }

  public onPlayerContact(maria: Maria): void {
    maria.takeDamage();
  }

  public onStomped(): void {
    if (!this.isAlive) return;
    this.isAlive = false;

    this.play(ANIMS.GOOMBA_DEAD, true);
    this.scene.events.emit(EVENTS.ENEMY_DIED);
    // updateDead() se encarga del movimiento desde aquí en adelante
  }

  public destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
