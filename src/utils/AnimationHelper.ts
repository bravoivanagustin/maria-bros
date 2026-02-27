import { ANIMS, ASSETS } from './constants';

export class AnimationHelper {
  static createAll(anims: Phaser.Animations.AnimationManager): void {
    AnimationHelper.createMariaAnims(anims);
    AnimationHelper.createGoombaAnims(anims);
    AnimationHelper.createCoinAnims(anims);
    AnimationHelper.createAgustinAnims(anims);
  }

  private static createMariaAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: idle(0-1) walk(2-5) jump(6) death(7-9)
    anims.create({
      key: ANIMS.MARIA_IDLE,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1,
    });
    anims.create({
      key: ANIMS.MARIA_WALK,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 2, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: ANIMS.MARIA_JUMP,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 6, end: 6 }),
      frameRate: 1,
      repeat: 0,
    });
    anims.create({
      key: ANIMS.MARIA_DEATH,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 7, end: 9 }),
      frameRate: 6,
      repeat: 0,
    });
  }

  private static createGoombaAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: walk(0-1) dead(2-3)
    anims.create({
      key: ANIMS.GOOMBA_WALK,
      frames: anims.generateFrameNumbers(ASSETS.ENEMY_GOOMBA, { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    });
    anims.create({
      key: ANIMS.GOOMBA_DEAD,
      frames: anims.generateFrameNumbers(ASSETS.ENEMY_GOOMBA, { start: 2, end: 3 }),
      frameRate: 4,
      repeat: 0,
    });
  }

  private static createCoinAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: spin(0-3)
    anims.create({
      key: ANIMS.COIN_SPIN,
      frames: anims.generateFrameNumbers(ASSETS.COIN, { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  private static createAgustinAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: idle(0-1)
    anims.create({
      key: ANIMS.AGUSTIN_IDLE,
      frames: anims.generateFrameNumbers(ASSETS.PRINCESS, { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1,
    });
  }
}
