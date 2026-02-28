import { Entity } from './Entity';
import { ANIMS, ASSETS, EVENTS, PHYSICS } from '../utils/constants';
import type { InputSystem } from '../systems/InputSystem';

export enum MariaState {
  IDLE = 'IDLE',
  WALKING = 'WALKING',
  JUMPING = 'JUMPING',
  DEAD = 'DEAD',
  WINNING = 'WINNING',
}

export class Maria extends Entity {
  private mariaState: MariaState = MariaState.IDLE;
  private canJump: boolean = true;
  private winLandingHandled: boolean = false;
  private winWalkReady: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.PLAYER, 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 14);
    body.setOffset(2, 1);
    body.setCollideWorldBounds(true);

    this.play(ANIMS.MARIA_IDLE);
  }

  public update(_delta: number, input: InputSystem): void {
    if (this.mariaState === MariaState.DEAD) return;

    // Victoria: cae al suelo, espera 1 segundo y camina sola hacia la derecha
    if (this.mariaState === MariaState.WINNING) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      this.setFlipX(false);
      if (this.winWalkReady) {
        body.setVelocityX(PHYSICS.PLAYER_SPEED * 0.6);
        this.play(ANIMS.MARIA_WALK, true);
      } else if (!body.blocked.down) {
        body.setVelocityX(0);
        this.play(ANIMS.MARIA_JUMP, true);
      } else {
        body.setVelocityX(0);
        this.play(ANIMS.MARIA_IDLE, true);
        if (!this.winLandingHandled) {
          this.winLandingHandled = true;
          this.scene.time.delayedCall(1000, () => {
            this.winWalkReady = true;
          });
        }
      }
      return;
    }

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

  /** Llamado al tocar la bandera: congela el input y espera al suelo antes de auto-caminar */
  public startWinSequence(): void {
    if (this.mariaState === MariaState.DEAD || this.mariaState === MariaState.WINNING) return;
    this.mariaState = MariaState.WINNING;
    this.winLandingHandled = false;
    this.winWalkReady = false;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);
  }

  public takeDamage(): void {
    if (this.mariaState === MariaState.DEAD) return;

    this.changeState(MariaState.DEAD);
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Freeze en el lugar mientras muere (clásico Mario)
    body.setVelocity(0, 0);
    body.allowGravity = false;

    this.scene.events.emit(EVENTS.PLAYER_DIED);

    // Después de la pausa visual, salta y cae sin colisionar con nada
    this.scene.time.delayedCall(500, () => {
      body.allowGravity = true;
      body.setCollideWorldBounds(false);
      body.checkCollision.none = true;
      body.setVelocityY(-420);
    });
  }

  /** Muerte por caída en un foso — no rebota, sigue cayendo */
  public fallIntoPit(): void {
    if (this.mariaState === MariaState.DEAD) return;

    this.changeState(MariaState.DEAD);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);
    body.setCollideWorldBounds(false);
    body.checkCollision.none = true;

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
