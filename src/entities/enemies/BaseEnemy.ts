import { Entity } from '../Entity';
import type { Maria } from '../Maria';

export abstract class BaseEnemy extends Entity {
  // BaseEnemy implementa update() propio (no viene de Entity)
  // y delega en onUpdate() que cada enemigo concreto implementa.
  protected isAlive: boolean = true;

  public abstract onPlayerContact(maria: Maria): void;
  public abstract onStomped(): void;
  protected abstract onUpdate(delta: number): void;

  public update(delta: number): void {
    if (!this.isAlive) return;
    this.onUpdate(delta);
  }

  public destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
