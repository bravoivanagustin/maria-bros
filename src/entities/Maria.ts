import { Entity } from './Entity';
import { ANIMS, ASSETS, EVENTS, PHYSICS } from '../utils/constants';
import type { InputSystem } from '../systems/InputSystem';

export enum MariaState {
  IDLE = 'IDLE',
  WALKING = 'WALKING',
  JUMPING = 'JUMPING',
  DEAD = 'DEAD',
}

export class Maria extends Entity {
  private mariaState: MariaState = MariaState.IDLE;
  private canJump: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.PLAYER, 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 14);
    body.setOffset(2, 1);
    body.setCollideWorldBounds(true);

    this.play(ANIMS.MARIA_IDLE);
  }

  public update(delta: number, input: InputSystem): void {
    if (this.mariaState === MariaState.DEAD) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    // Movimiento horizontal
    if (input.isLeft()) {
      body.setVelocityX(-PHYSICS.PLAYER_SPEED);
      this.setFlipX(true);
      if (onGround) this.changeState(MariaState.WALKING);
    } else if (input.isRight()) {
      body.setVelocityX(PHYSICS.PLAYER_SPEED);
      this.setFlipX(false);
      if (onGround) this.changeState(MariaState.WALKING);
    } else {
      body.setVelocityX(0);
      if (onGround) this.changeState(MariaState.IDLE);
    }

    // Salto
    if (input.isJustJumped() && onGround && this.canJump) {
      this.jump();
    }

    // Actualizar canJump
    if (onGround) {
      this.canJump = true;
    }

    // Estado aéreo
    if (!onGround) {
      this.changeState(MariaState.JUMPING);
    }
  }

  private jump(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(PHYSICS.JUMP_VELOCITY);
    this.canJump = false;
    this.changeState(MariaState.JUMPING);
    this.scene.events.emit(EVENTS.PLAYER_JUMPED);
  }

  public bounceOnStomp(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(PHYSICS.JUMP_VELOCITY * 0.5);
  }

  public takeDamage(): void {
    if (this.mariaState === MariaState.DEAD) return;

    this.changeState(MariaState.DEAD);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, -300);
    body.setCollideWorldBounds(false);

    this.scene.events.emit(EVENTS.PLAYER_DIED);
  }

  private changeState(newState: MariaState): void {
    if (this.mariaState === newState) return;
    this.mariaState = newState;

    switch (newState) {
      case MariaState.IDLE:
        this.play(ANIMS.MARIA_IDLE, true);
        break;
      case MariaState.WALKING:
        this.play(ANIMS.MARIA_WALK, true);
        break;
      case MariaState.JUMPING:
        this.play(ANIMS.MARIA_JUMP, true);
        break;
      case MariaState.DEAD:
        this.play(ANIMS.MARIA_DEATH, true);
        break;
    }
  }

  public getState(): MariaState {
    return this.mariaState;
  }
}
